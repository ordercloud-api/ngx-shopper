import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { of } from 'rxjs';
import { OcProductService } from '@ordercloud/angular-sdk';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ProductTableComponent } from '@app-seller/product-management/containers/product-table/product-table.component';
import { ModalService } from '@app-seller/shared';

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
