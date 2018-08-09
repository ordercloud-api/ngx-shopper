import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ListCategory, Category } from '@ordercloud/angular-sdk';
import { ITreeOptions } from 'angular-tree-component';
import { CategoryTreeNode } from '@app-buyer/products/models/category-tree-node.class';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'products-category-nav',
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
      return this.activeCategoryID == node.id ? 'font-weight-bold' : null;
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

  constructor(
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.categoryTree = this.buildCategoryTree(this.categories.Items);
    this.activatedRoute.queryParams.subscribe((queryParams) => {
      this.activeCategoryID = queryParams.category;
    })
  }

  buildCategoryTree(ocCategories: Category[]): CategoryTreeNode[] {
    const table = ocCategories.reduce((acc, x) => {
      const node = new CategoryTreeNode();
      node.id = x.ID;
      node.name = x.Name;
      node.data = x;
      node.children = [];
      acc[x.ID] = node;
      return acc;
    }, {});

    for (const key in table) {
      if (!table.hasOwnProperty(key)) {
        continue;
      }

      if (!table[key].data.ParentID || !table[table[key].data.ParentID]) {
        continue;
      }

      table[table[key].data.ParentID].children.push(table[key]);
      table[key].parent = table[table[key].data.ParentID];
    }

    return Object.keys(table)
      .map((x) => table[x])
      .filter((x) => !x.data.ParentID);
  }
}
