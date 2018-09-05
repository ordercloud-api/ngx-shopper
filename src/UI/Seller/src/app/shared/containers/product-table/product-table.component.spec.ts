import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { of } from 'rxjs';
import { OcProductService, OcCategoryService } from '@ordercloud/angular-sdk';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ModalService } from '@app-seller/shared';
import { ProductTableComponent } from '@app-seller/shared/containers/product-table/product-table.component';
import { applicationConfiguration } from '@app-seller/config/app.config';

describe('ProductTableComponent', () => {
  let component: ProductTableComponent;
  let fixture: ComponentFixture<ProductTableComponent>;
  const mockProductList = { Items: [{ ID: 'productID' }] };
  const ocProductService = {
    List: jasmine.createSpy('List').and.returnValue(of(mockProductList)),
    Create: jasmine
      .createSpy('Create')
      .and.returnValue(of(mockProductList.Items[0])),
    Delete: jasmine.createSpy('Delete').and.returnValue(of({})),
  };
  const ocCategoryService = {
    ListProductAssignments: jasmine.createSpy('ListProductAssignments'),
    SaveProductAssignment: jasmine.createSpy('SaveProductAssignment'),
    DeleteProductAssignments: jasmine.createSpy('DeleteProductAssignment'),
  };

  const modalService = {
    open: jasmine.createSpy('open'),
    close: jasmine.createSpy('close'),
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProductTableComponent],
      providers: [
        { provide: OcProductService, useValue: ocProductService },
        { provide: ModalService, useValue: modalService },
        { provide: OcCategoryService, useValue: ocCategoryService },
        { provide: applicationConfiguration, useValue: { buyerID: 'buyerID' } },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('loadProducts', () => {
    beforeEach(() => {
      component.products = undefined;
      component.loadData();
    });
    it('should set products using OCProductsService', () => {
      expect(ocProductService.List).toHaveBeenCalled();
      expect(component.products).toEqual(mockProductList);
    });
  });

  describe('deleteProducts', () => {
    beforeEach(() => {
      spyOn(component, 'loadData');
      component.products = undefined;
      component.deleteProduct('testID');
    });
    it('should deleted products using OCProductsService', () => {
      expect(ocProductService.Delete).toHaveBeenCalledWith('testID');
      expect(component.loadData).toHaveBeenCalled();
    });
  });

  describe('addProducts', () => {
    beforeEach(() => {
      spyOn(component, 'loadData');
      component.addProduct(mockProductList.Items[0]);
    });
    it('should deleted products using OCProductsService', () => {
      expect(modalService.close).toHaveBeenCalled();
      expect(ocProductService.Create).toHaveBeenCalledWith(
        mockProductList.Items[0]
      );
      expect(component.loadData).toHaveBeenCalled();
    });
  });
});
