import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductTableComponent } from '@app-seller/product-management/product-table/product-table.component';
import { of } from 'rxjs';
import { OcProductService } from '@ordercloud/angular-sdk';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ProductTableComponent', () => {
  let component: ProductTableComponent;
  let fixture: ComponentFixture<ProductTableComponent>;
  const mockProductList = { Items: [{ ID: 'productID' }] };
  const ocProductService = {
    List: jasmine.createSpy('List').and.returnValue(of(mockProductList)),
    Delete: jasmine.createSpy('Delete').and.returnValue(of({})),
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProductTableComponent],
      providers: [{ provide: OcProductService, useValue: ocProductService }],
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
      component.loadProducts();
    });
    it('should set products using OCProductsService', () => {
      expect(ocProductService.List).toHaveBeenCalled();
      expect(component.products).toEqual(mockProductList);
    });
  });

  describe('deleteProducts', () => {
    beforeEach(() => {
      spyOn(component, 'loadProducts');
      component.products = undefined;
      component.deleteProduct('testID');
    });
    it('should deleted products using OCProductsService', () => {
      expect(ocProductService.Delete).toHaveBeenCalledWith('testID');
      expect(component.loadProducts).toHaveBeenCalled();
    });
  });

  describe('requestOptions', () => {
    it('should search, reseting page', () => {
      component.requestOptions = { page: 2, search: 'hose', sortBy: 'ID' };
      component.searchChanged('newSearch');
      expect(ocProductService.List).toHaveBeenCalledWith({
        page: undefined,
        search: 'newSearch',
        sortBy: 'ID',
      });
    });
    it('should change page, keeping search + sort', () => {
      component.requestOptions = { page: 2, search: 'hose', sortBy: 'ID' };
      component.pageChanged(3);
      expect(ocProductService.List).toHaveBeenCalledWith({
        page: 3,
        search: 'hose',
        sortBy: 'ID',
      });
    });
    it('should sort, resting page ', () => {
      component.requestOptions = { page: 2, search: 'hose', sortBy: 'ID' };
      component.sortChanged('!ID');
      expect(ocProductService.List).toHaveBeenCalledWith({
        page: undefined,
        search: 'hose',
        sortBy: '!ID',
      });
    });
  });
});
