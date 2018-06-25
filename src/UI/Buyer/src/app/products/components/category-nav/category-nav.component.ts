import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ListCategory, Category } from '@ordercloud/angular-sdk';
import { ITreeOptions } from 'angular-tree-component';
import { CategoryTreeNode } from '@app/products/models/category-tree-node.class';

@Component({
  selector: 'category-nav',
  templateUrl: './category-nav.component.html',
  styleUrls: ['./category-nav.component.scss']
})
export class CategoryNavComponent implements OnInit {
  @Input() categories: ListCategory; 
  @Output() selection = new EventEmitter<CategoryTreeNode>();
  categoryTree: CategoryTreeNode[];  
  options: ITreeOptions = {
    actionMapping: {
        mouse: {
            click: (_tree, _node, _$event) => { this.selection.emit(_node.id); }
        },
    },
    animateExpand: true
  };
  
  constructor() { }

  ngOnInit() {
    this.categoryTree = this.buildCategoryTree(this.categories.Items);
  }

  buildCategoryTree(ocCategories: Category[]): CategoryTreeNode[] {
    const table = ocCategories.reduce((acc, x) => {
      let node = new CategoryTreeNode();
      node.id = x.ID;
      node.name = x.Name;
      node.data = x;
      node.children = [];
      acc[x.ID] = node;
      return acc;
    }, {});

    for (var key in table) {
      if (!table.hasOwnProperty(key)) continue;

      if (!table[key].data.ParentID || !table[table[key].data.ParentID]) {
        continue;
      }

      table[table[key].data.ParentID].children.push(table[key]);
      table[key].parent = table[table[key].data.ParentID];
    }

    return Object.keys(table).map(x => table[x]).filter(x => !x.data.ParentID)
  }
}
