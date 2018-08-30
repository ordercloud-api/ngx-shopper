import { Component, OnInit, Inject } from '@angular/core';
import { faTrashAlt, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import {
  ListCategory,
  Category,
  OcCategoryService,
} from '@ordercloud/angular-sdk';
import {
  AppConfig,
  applicationConfiguration,
} from '@app-seller/config/app.config';
import { ModalService } from '@app-seller/shared/services/modal/modal.service';
import { CategoryTreeNode } from '@app-seller/shared/models/category-tree-node.class';
import { ITreeOptions } from 'angular-tree-component';
import { forkJoin, Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'category-management',
  templateUrl: './category-management.component.html',
  styleUrls: ['./category-management.component.scss'],
})
export class CategoryManagementComponent implements OnInit {
  modalID = 'CreateCategoryModal';
  faTrash = faTrashAlt;
  faPlusCircle = faPlusCircle;
  catalogID: string;
  categories: Category[];
  categoryTree: CategoryTreeNode[];
  treeOptions: ITreeOptions = {
    allowDrag: true,
    allowDrop: true,
    actionMapping: {
      mouse: {
        click: (_tree, _node, _$event) => {
          this.router.navigateByUrl(`/categories/${_node.data.id}`);
        },
      },
    },
    animateExpand: true,
  };

  constructor(
    private ocCategoryService: OcCategoryService,
    private modalService: ModalService,
    private router: Router,
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

  addCategory(category: Category) {
    this.modalService.close(this.modalID);
    this.ocCategoryService.Create(this.catalogID, category).subscribe(() => {
      this.loadCategories();
    });
  }

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
    moved.ParentID = $event.to.parent.virtual ? null : $event.to.parent.id;

    // of the sibling categories, the original moved one and the displaced ones
    const reordered: Category[] = siblings.filter((category, index) => {
      return (
        category.ID === moved.ID ||
        this.categories.find((x) => x.ID === category.ID).ListOrder !== index
      );
    });

    const queue: Observable<Category>[] = reordered.map((category) => {
      category.ListOrder = (category as any).siblingIndex;
      return this.ocCategoryService.Patch(
        this.catalogID,
        category.ID,
        category
      );
    });
    forkJoin(queue).subscribe(() => this.loadCategories());
  }

  loadCategories(): void {
    this.ocCategoryService
      .List(this.catalogID, { depth: 'all', pageSize: 100 })
      .subscribe((categories) => {
        this.categories = categories.Items;
        this.categoryTree = this.buildCategoryTree(categories.Items);
      });
  }

  buildCategoryTree(ocCategories: Category[]): CategoryTreeNode[] {
    const orderedIDs = ocCategories.map((x) => x.ID);
    // key is ID, value is Node
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
    return orderedIDs
      .map((x) => nodeDict[x])
      .filter((x) => !x.category.ParentID);
  }
}
