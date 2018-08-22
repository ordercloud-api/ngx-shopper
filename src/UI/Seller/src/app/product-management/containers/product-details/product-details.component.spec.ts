import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDetailsComponent } from '@app-seller/product-management/containers/product-details/product-details.component';
import { OcProductService } from '@ordercloud/angular-sdk';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { BehaviorSubject, of } from 'rxjs';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ProductDetailsComponent', () => {
  let component: ProductDetailsComponent;
  let fixture: ComponentFixture<ProductDetailsComponent>;
  const mockProduct = { ID: 'myID' };

  const productService = {
    Get: jasmine.createSpy('Get').and.returnValue(of(mockProduct)),
    Patch: jasmine.createSpy('Patch').and.returnValue(of(mockProduct)),
  };

  const activatedRoute = {
    params: new BehaviorSubject<any>({ productID: mockProduct.ID }),
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProductDetailsComponent],
      imports: [RouterTestingModule, FontAwesomeModule],
      providers: [
        { provide: OcProductService, useValue: productService },
        { provide: ActivatedRoute, useValue: activatedRoute },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    spyOn(component, 'getProductData').and.returnValue(of(mockProduct));
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      spyOn(component, 'getProductData').and.returnValue(of(mockProduct));
      component.ngOnInit();
    });
    it('should set product', () => {
      expect(component.getProductData).toHaveBeenCalled();
    });
  });

  describe('GetProductData', () => {
    it('should call OcProductService and set productID', () => {
      component.getProductData();
      expect(component.productID).toEqual(mockProduct.ID);
      expect(productService.Get).toHaveBeenCalled();
    });
  });

  describe('updateProduct', () => {
    it('should update using existing productID', () => {
      const mock = { ID: 'newID' };
      component.updateProduct(mock);
      expect(productService.Patch).toHaveBeenCalledWith(
        component.productID,
        mock
      );
    });
  });
});
