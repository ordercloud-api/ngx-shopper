import { Component, OnInit, Inject, Input } from '@angular/core';
import {
  faTrashAlt,
  faPlusCircle,
  faCircle,
} from '@fortawesome/free-solid-svg-icons';
import {
  Category,
  OcCategoryService,
  ListCategoryAssignment,
  OcCatalogService,
} from '@ordercloud/angular-sdk';
import {
  AppConfig,
  applicationConfiguration,
} from '@app-seller/config/app.config';
import { ModalService } from '@app-seller/shared/services/modal/modal.service';
import {
  CategoryTreeNode,
  AssignedCategory,
} from '@app-seller/shared/models/category-tree-node.class';
import { ITreeOptions } from 'angular-tree-component';
import { forkJoin, Observable } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';
import { remove as _remove } from 'lodash';

@Component({
  selector: 'category-table',
  templateUrl: './category-table.component.html',
  styleUrls: ['./category-table.component.scss'],
})
export class CategoryTableComponent implements OnInit {
  modalID = 'CreateCategoryModal';
  faTrash = faTrashAlt;
  faPlusCircle = faPlusCircle;
  faCircle = faCircle;
  // Use for assigning categories to user groups
  @Input()
  userGroupID: string;

  catalogID: string;
  categories: AssignedCategory[];
  categoryTree: CategoryTreeNode[];
  treeOptions: ITreeOptions = {
    allowDrag: true,
    allowDrop: true,
    animateExpand: true,
    levelPadding: 40,
  };

  constructor(
    private ocCategoryService: OcCategoryService,
    private modalService: ModalService,
    private ocCatalogService: OcCatalogService,
    @Inject(applicationConfiguration) private appConfig: AppConfig
  ) {}

  ngOnInit() {
    // The default for a new OC buyer organization is one Catalog with ID equal to the buyerID
    this.catalogID = this.appConfig.buyerID;
    this.loadCategories();
  }

  openModal() {
    this.modalService.open(this.modalID);
  }

  addCategory(category: Category): void {
    this.modalService.close(this.modalID);
    this.ocCategoryService.Create(this.catalogID, category).subscribe(() => {
      this.loadCategories();
    });
  }

  deleteCategory(categoryID: string): void {
    this.ocCategoryService.Delete(this.catalogID, categoryID).subscribe(() => {
      this.loadCategories();
    });
  }

  loadCategories(): void {
    this.ocCategoryService
      .List(this.catalogID, { depth: 'all', pageSize: 100 })
      .subscribe((categories) => {
        const requests = categories.Items.map((cat) => this.getAssignment(cat));
        forkJoin(requests).subscribe((res: ListCategoryAssignment[]) => {
          res.forEach((assignment, index) => {
            if (assignment.Items.length === 0) return;
            (categories.Items[index] as AssignedCategory).Assigned =
              assignment.Items[0].Visible &&
              assignment.Items[0].ViewAllProducts;
          });
          this.categories = categories.Items as AssignedCategory[];
          this.categoryTree = this.buildCategoryTree(this.categories);
          this.cascadeParentAssignments();
        });
      });
  }

  // For now, assigning a parent categories automatically assigns all children.
  // This is shown to the user through category.AssignedByParent field.
  cascadeParentAssignments() {
    function checkNode(node: CategoryTreeNode) {
      if (
        node.parent &&
        (node.parent.category.Assigned || node.parent.category.AssignedByParent)
      ) {
        node.category.AssignedByParent = true;
      }
      node.children.forEach((child) => checkNode(child));
    }

    this.categoryTree.forEach((topLevelCat) => checkNode(topLevelCat));
  }

  getAssignment(category: Category): Observable<ListCategoryAssignment> {
    return this.ocCategoryService
      .ListAssignments(this.catalogID, {
        buyerID: this.appConfig.buyerID,
        categoryID: category.ID,
        userGroupID: this.userGroupID || undefined,
      })
      .pipe(
        map((assignments) => {
          _remove(
            assignments.Items,
            (assignment) =>
              assignment.UserGroupID !== (this.userGroupID || null) // for buyer-level assignments, userGroupID should be null
          );
          return assignments;
        })
      );
  }

  // Once API bug https://four51.atlassian.net/browse/EX-1366 is resolved this function won't be necessary
  resetCache(): Observable<any> {
    const assignment = {
      CatalogID: this.catalogID,
      BuyerID: this.appConfig.buyerID,
      ViewAllCategories: true,
    };
    return this.ocCatalogService.SaveAssignment(assignment).pipe(
      flatMap(() => {
        assignment.ViewAllCategories = false;
        return this.ocCatalogService.SaveAssignment(assignment);
      })
    );
  }

  // For now, all assignments default to visible: true, ViewAllProducts: true.
  assignCategory(categoryID: string, assigned: boolean) {
    const request = assigned
      ? this.ocCategoryService.SaveAssignment(this.catalogID, {
          CategoryID: categoryID,
          BuyerID: this.appConfig.buyerID,
          UserGroupID: this.userGroupID || undefined,
          Visible: true,
          ViewAllProducts: true,
        })
      : this.ocCategoryService.DeleteAssignment(
          this.catalogID,
          categoryID,
          this.appConfig.buyerID,
          {
            userGroupID: this.userGroupID || undefined,
          }
        );
    request.subscribe(() => {
      this.resetCache().subscribe();
      this.loadCategories();
    });
  }

  // uses OC property category.ListOrder to save the display order of categories
  onMoveNode($event): void {
    // sibling categories in the new location
    const siblings: Category[] = $event.to.parent.children.map(
      (node, index) => {
        node.category.siblingIndex = index;
        return node.category;
      }
    );

    // the category that the user moved
    const moved: Category = siblings.find(
      (x) => x.ID === $event.node.category.ID
    );
    // updates the parentID if category became nested
    moved.ParentID = $event.to.parent.virtual ? null : $event.to.parent.id;

    // of the sibling categories get the displaced ones
    const displaced: Category[] = siblings.filter(
      (category, index) =>
        this.categories.find((x) => x.ID === category.ID).ListOrder !== index
    );

    const queue: Observable<Category>[] = [moved, ...displaced].map(
      (category) => {
        category.ListOrder = (category as any).siblingIndex;
        return this.ocCategoryService.Patch(
          this.catalogID,
          category.ID,
          category
        );
      }
    );
    forkJoin(queue).subscribe(() => this.loadCategories());
  }

  buildCategoryTree(ocCategories: AssignedCategory[]): CategoryTreeNode[] {
    const orderedIDs = ocCategories.map((x) => x.ID);
    // in nodeDictionary, key is categoryID, value is a CategoryTreeNode
    const nodeDict = ocCategories.reduce((acc, x) => {
      const node = new CategoryTreeNode();
      node.id = x.ID;
      node.name = x.Name;
      node.category = x;
      node.children = [];
      acc[x.ID] = node;
      return acc;
    }, {});

    // Ordered by ListOrder. That order will be preserved within an array of child nodes.
    orderedIDs.forEach((id) => {
      if (
        !nodeDict[id].category.ParentID ||
        !nodeDict[nodeDict[id].category.ParentID]
      ) {
        // category is not a child node
        return;
      }
      nodeDict[nodeDict[id].category.ParentID].children.push(nodeDict[id]);
      nodeDict[id].parent = nodeDict[nodeDict[id].category.ParentID];
    });

    // Return all top-level nodes in order
    return orderedIDs.map((x) => nodeDict[x]).filter((x) => !x.parent);
  }

  getAlertText(): string {
    return this.userGroupID ? 'this user group.' : 'all users.';
  }
}
