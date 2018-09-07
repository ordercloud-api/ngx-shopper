import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ListCategory, Category } from '@ordercloud/angular-sdk';
import { ITreeOptions } from 'angular-tree-component';
import { CategoryTreeNode } from '@app-buyer/product/models/category-tree-node.class';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'product-category-nav',
  templateUrl: './category-nav.component.html',
  styleUrls: ['./category-nav.component.scss'],
})
export class CategoryNavComponent implements OnInit {
  @Input() categories: ListCategory;
  @Output() selection = new EventEmitter<CategoryTreeNode>();
  categoryTree: CategoryTreeNode[];
  private activeCategoryID: string;
  options: ITreeOptions = {
    nodeClass: (node: CategoryTreeNode) => {
      return this.activeCategoryID === node.id ? 'font-weight-bold' : null;
    },
    actionMapping: {
      mouse: {
        click: (_tree, _node, _$event) => {
          this.selection.emit(_node.id);
        },
      },
    },
    animateExpand: true,
  };

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.categoryTree = this.buildCategoryTree(this.categories.Items);
    this.activatedRoute.queryParams.subscribe((queryParams) => {
      this.activeCategoryID = queryParams.category;
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
}
