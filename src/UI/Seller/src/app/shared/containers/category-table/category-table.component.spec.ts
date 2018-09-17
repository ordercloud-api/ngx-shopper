import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoryTableComponent } from './category-table.component';
import { OcCategoryService, OcCatalogService } from '@ordercloud/angular-sdk';
import { applicationConfiguration } from '@app-seller/config/app.config';
import { ModalService } from '@app-seller/shared/services/modal/modal.service';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { CategoryTreeNode } from '@app-seller/shared/models/category-tree-node.class';
import { cloneDeep as _cloneDeep } from 'lodash';

describe('CategoryTableComponent', () => {
  let component: CategoryTableComponent;
  let fixture: ComponentFixture<CategoryTableComponent>;
  const mockCategories = {
    Items: [
      { ID: 'a' },
      { ID: 'b', ParentID: 'a' },
      { ID: 'c', ParentID: 'b' },
      { ID: 'd', ParentID: 'c' },
    ],
  };
  const mocKAssignmentList = {
    Items: [],
  };
  const ocCatalogService = {
    SaveAssignment: jasmine.createSpy('SaveAssignment').and.returnValue(of({})),
  };
  const ocCategoryService = {
    ListAssignments: jasmine
      .createSpy('ListAssignments')
      .and.returnValue(of(mocKAssignmentList)),
    SaveAssignment: jasmine.createSpy('SaveAssignment').and.returnValue(of({})),
    DeleteAssignment: jasmine
      .createSpy('DeleteAssignment')
      .and.returnValue(of({})),
    Create: jasmine.createSpy('Create').and.returnValue(of({})),
    List: jasmine.createSpy('List').and.returnValue(of(mockCategories)),
    Delete: jasmine.createSpy('Delete').and.returnValue(of({})),
    Patch: jasmine.createSpy('Patch'),
  };

  const modalService = {
    open: jasmine.createSpy('open'),
    close: jasmine.createSpy('close'),
  };

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

  const buildTreeObjectHelper = () => {
    const a = TreeNode({
      id: 'a',
      name: undefined,
      category: mockCategories.Items[0],
    });
    const b = TreeNode({
      id: 'b',
      name: undefined,
      category: mockCategories.Items[1],
    });
    const c = TreeNode({
      id: 'c',
      name: undefined,
      category: mockCategories.Items[2],
    });
    const d = TreeNode({
      id: 'd',
      name: undefined,
      category: mockCategories.Items[3],
    });

    d.children = [];
    c.children = [d];
    b.children = [c];
    a.children = [b];

    b.parent = a;
    c.parent = b;
    d.parent = c;

    return [a];
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CategoryTableComponent],
      imports: [FontAwesomeModule],
      providers: [
        { provide: ModalService, useValue: modalService },
        { provide: OcCategoryService, useValue: ocCategoryService },
        { provide: OcCatalogService, useValue: ocCatalogService },
        { provide: applicationConfiguration, useValue: { buyerID: 'buyerID' } },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoryTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('loadData', () => {
    it('should set categoryTree using OCUsersService', () => {
      spyOn(component, 'buildCategoryTree');
      spyOn(component, 'cascadeParentAssignments');
      component.categoryTree = undefined;
      component.loadCategories();
      expect(ocCategoryService.List).toHaveBeenCalled();
      expect(component.buildCategoryTree).toHaveBeenCalled();
      expect(component.cascadeParentAssignments).toHaveBeenCalled();
    });
    it('should try to get the assignment for each category', () => {
      ocCategoryService.ListAssignments.calls.reset();
      component.loadCategories();
      expect(ocCategoryService.ListAssignments.calls.count()).toEqual(
        mockCategories.Items.length
      );
    });
    it('should not set the assigned property on component.category if assignment does not exist', () => {
      ocCategoryService.ListAssignments.and.returnValue(
        of({
          Items: [],
        })
      );
      component.loadCategories();
      expect(component.categories[0].Assigned).toEqual(undefined);
    });
    it('should set the assigned property on component.category if assignment exists', () => {
      ocCategoryService.ListAssignments.and.returnValue(
        of({
          Items: [{ UserGroupID: null, Visible: true, ViewAllProducts: true }],
        })
      );
      component.loadCategories();
      expect(component.categories[0].Assigned).toEqual(true);
    });
  });

  describe('reset cache', () => {
    it('should set catalog.ViewAllCategories true and then false', () => {
      component.resetCache().subscribe();
      expect(ocCatalogService.SaveAssignment.calls.count()).toBe(2);
      expect(ocCatalogService.SaveAssignment).toHaveBeenCalledWith({
        CatalogID: 'buyerID',
        BuyerID: 'buyerID',
        ViewAllCategories: false,
      });
    });
  });

  describe('assignCateogry usergroup level', () => {
    beforeEach(() => {
      component.userGroupID = 'group';
    });
    it('should create assignment when parameter is true', () => {
      component.assignCategory('categoryID', true);
      expect(ocCategoryService.SaveAssignment).toHaveBeenCalledWith('buyerID', {
        CategoryID: 'categoryID',
        BuyerID: 'buyerID',
        UserGroupID: 'group',
        Visible: true,
        ViewAllProducts: true,
      });
    });
    it('should delete assignment when parameter is false', () => {
      component.assignCategory('categoryID', false);
      expect(ocCategoryService.DeleteAssignment).toHaveBeenCalledWith(
        'buyerID',
        'categoryID',
        'buyerID',
        {
          userGroupID: 'group',
        }
      );
    });
  });

  describe('assignCateogry buyer level', () => {
    beforeEach(() => {
      component.userGroupID = undefined;
    });
    it('should create assignment when parameter is true', () => {
      component.assignCategory('categoryID', true);
      expect(ocCategoryService.SaveAssignment).toHaveBeenCalledWith('buyerID', {
        CategoryID: 'categoryID',
        BuyerID: 'buyerID',
        UserGroupID: undefined,
        Visible: true,
        ViewAllProducts: true,
      });
    });
    it('should delete assignment when parameter is false', () => {
      component.assignCategory('categoryID', false);
      expect(ocCategoryService.DeleteAssignment).toHaveBeenCalledWith(
        'buyerID',
        'categoryID',
        'buyerID',
        {
          userGroupID: undefined,
        }
      );
    });
  });

  describe('deleteCategory', () => {
    beforeEach(() => {
      spyOn(component, 'loadCategories');
      component.deleteCategory('categoryID');
    });
    it('should delete user using OCUsersService', () => {
      expect(ocCategoryService.Delete).toHaveBeenCalledWith(
        'buyerID',
        'categoryID'
      );
      expect(component.loadCategories).toHaveBeenCalled();
    });
  });

  describe('deleteCategory', () => {
    beforeEach(() => {
      spyOn(component, 'loadCategories');
      component.addCategory(mockCategories.Items[0]);
    });
    it('should add user using OCUsersService', () => {
      expect(modalService.close).toHaveBeenCalled();
      expect(ocCategoryService.Create).toHaveBeenCalledWith(
        'buyerID',
        mockCategories.Items[0]
      );
      expect(component.loadCategories).toHaveBeenCalled();
    });
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
      expect(component.buildCategoryTree(mockCategories.Items)).toEqual(
        buildTreeObjectHelper()
      );
    });
  });
  const clearAssignments = () => {
    component.categoryTree[0].category.Assigned = false;
    component.categoryTree[0].category.AssignedByParent = false;
    component.categoryTree[0].children[0].category.Assigned = false;
    component.categoryTree[0].children[0].category.AssignedByParent = false;
    component.categoryTree[0].children[0].children[0].category.Assigned = false;
    component.categoryTree[0].children[0].children[0].category.AssignedByParent = false;
    component.categoryTree[0].children[0].children[0].children[0].category.Assigned = false;
    component.categoryTree[0].children[0].children[0].children[0].category.AssignedByParent = false;
  };
  describe('cascadeParentAssignments', () => {
    beforeEach(() => {
      clearAssignments();
    });
    it('should not change tree when no assignments', () => {
      component.cascadeParentAssignments();
      expect(component.categoryTree).toEqual(buildTreeObjectHelper());
    });
    it('should change the tree when assignments exist', () => {
      component.categoryTree[0].category.Assigned = true;
      const treeBeforeMutation = _cloneDeep(component.categoryTree);
      component.cascadeParentAssignments();
      expect(component.categoryTree).not.toEqual(treeBeforeMutation);
    });
    it('should not cascade assignments when only leaf nodes are assigned', () => {
      component.categoryTree[0].children[0].children[0].children[0].category.Assigned = true;
      const treeBeforeMutation = _cloneDeep(component.categoryTree);
      component.cascadeParentAssignments();
      expect(component.categoryTree).toEqual(treeBeforeMutation);
    });
    it('should cascade assignments down one level', () => {
      component.categoryTree[0].children[0].children[0].category.Assigned = true;
      const treeAfterMutation = _cloneDeep(component.categoryTree);
      treeAfterMutation[0].children[0].children[0].children[0].category.AssignedByParent = true;
      component.cascadeParentAssignments();
      expect(component.categoryTree).toEqual(treeAfterMutation);
    });
    it('should cascade assignments down all levels', () => {
      component.categoryTree[0].category.Assigned = true;
      const treeAfterMutation = _cloneDeep(component.categoryTree);
      treeAfterMutation[0].children[0].children[0].children[0].category.AssignedByParent = true;
      treeAfterMutation[0].children[0].children[0].category.AssignedByParent = true;
      treeAfterMutation[0].children[0].category.AssignedByParent = true;
      component.cascadeParentAssignments();
      expect(component.categoryTree).toEqual(treeAfterMutation);
    });
  });
});
