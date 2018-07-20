import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryNavComponent } from '@app/products/components/category-nav/category-nav.component';
import { TreeModule } from 'angular-tree-component';
import { CategoryTreeNode } from '@app/products/models/category-tree-node.class';

describe('CategoryNavComponent', () => {
  let component: CategoryNavComponent;
  let fixture: ComponentFixture<CategoryNavComponent>;
  const TreeNode = fields => {
    const node = new CategoryTreeNode();
    if (fields.id) { node.id = fields.id; }
    if (fields.children) { node.children = fields.children; }
    if (fields.data) { node.data = fields.data; }
    if (fields.parent) { node.parent = fields.parent; }
    node.name = fields.name;
    return node;
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CategoryNavComponent
      ],
      imports: [
        TreeModule
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryNavComponent);
    component = fixture.componentInstance;
    component.categories = { Items: [] };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('buildCategoryTree', () => {
    it('should return nothing when no categories', () => {
      const input = [];
      const expectedResult = [];

      expect(component.buildCategoryTree(input)).toEqual(expectedResult);
    });
    it('should return correctly when no nesting', () => {
      const input = [
        { ID: 'a'},
        { ID: 'b'}
      ];
      const expectedResult = [
        TreeNode({ id: 'a', name: undefined, data: input[0], children: [] }),
        TreeNode({ id: 'b', name: undefined, data: input[1], children: [] })
      ];

      expect(component.buildCategoryTree(input)).toEqual(expectedResult);
    });
    it('should return four levels of nesting correctly', () => {
      const input = [
        { ID: 'a'},
        { ID: 'b', ParentID: 'a' },
        { ID: 'c', ParentID: 'b' },
        { ID: 'd', ParentID: 'c' }
      ];
      const a = TreeNode({ id: 'a', name: undefined, data: input[0] });
      const b = TreeNode({ id: 'b', name: undefined, data: input[1] });
      const c = TreeNode({ id: 'c', name: undefined, data: input[2] });
      const d = TreeNode({ id: 'd', name: undefined, data: input[3] });

      d.children = [];
      c.children = [d];
      b.children = [c];
      a.children = [b];

      b.parent = a;
      c.parent = b;
      d.parent = c;

      expect(component.buildCategoryTree(input)).toEqual([a]);
    });
  });
});
