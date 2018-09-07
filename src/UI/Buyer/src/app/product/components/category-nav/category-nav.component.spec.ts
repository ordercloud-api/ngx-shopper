import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CategoryNavComponent } from '@app-buyer/product/components/category-nav/category-nav.component';
import { TreeModule } from 'angular-tree-component';
import { CategoryTreeNode } from '@app-buyer/product/models/category-tree-node.class';
import { BehaviorSubject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

describe('CategoryNavComponent', () => {
  let component: CategoryNavComponent;
  let fixture: ComponentFixture<CategoryNavComponent>;
  const mockCategoryID = '12345';
  const TreeNode = (fields) => {
    const node = new CategoryTreeNode();
    if (fields.id) {
      node.id = fields.id;
    }
    if (fields.children) {
      node.children = fields.children;
    }
    if (fields.category) {
      node.category = fields.category;
    }
    if (fields.parent) {
      node.parent = fields.parent;
    }
    node.name = fields.name;
    return node;
  };

  const queryParams = new BehaviorSubject<any>({ category: mockCategoryID });
  const activatedRoute = {
    navigate: jasmine.createSpy('navigate'),
    queryParams,
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CategoryNavComponent],
      providers: [{ provide: ActivatedRoute, useValue: activatedRoute }],
      imports: [TreeModule],
    }).compileComponents();
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
      const input = [{ ID: 'a' }, { ID: 'b' }];
      const expectedResult = [
        TreeNode({
          id: 'a',
          name: undefined,
          category: input[0],
          children: [],
        }),
        TreeNode({
          id: 'b',
          name: undefined,
          category: input[1],
          children: [],
        }),
      ];

      expect(component.buildCategoryTree(input)).toEqual(expectedResult);
    });
    it('should return four levels of nesting correctly', () => {
      const input = [
        { ID: 'a' },
        { ID: 'b', ParentID: 'a' },
        { ID: 'c', ParentID: 'b' },
        { ID: 'd', ParentID: 'c' },
      ];
      const a = TreeNode({ id: 'a', name: undefined, category: input[0] });
      const b = TreeNode({ id: 'b', name: undefined, category: input[1] });
      const c = TreeNode({ id: 'c', name: undefined, category: input[2] });
      const d = TreeNode({ id: 'd', name: undefined, category: input[3] });

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
