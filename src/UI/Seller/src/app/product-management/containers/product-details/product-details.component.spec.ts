import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDetailsComponent } from '@app-seller/product-management/containers/product-details/product-details.component';
import { OcProductService } from '@ordercloud/angular-sdk';
import { ToastrService } from 'ngx-toastr';
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

  const toastrService = {
    error: jasmine.createSpy('error'),
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProductDetailsComponent],
      imports: [RouterTestingModule, FontAwesomeModule],
      providers: [
        { provide: OcProductService, useValue: productService },
        { provide: ToastrService, useValue: toastrService },
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
    it('should call OcProductService', () => {
      component.getProductData();
      expect(productService.Get).toHaveBeenCalled();
    });
  });

  describe('updateProduct', () => {
    it('should throw error if no product ID', () => {
      expect(() => component.updateProduct({})).toThrow(
        new Error('Cannot update a product without an ID')
      );
    });
    it('should update the product', () => {
      component.updateProduct(mockProduct);
      expect(productService.Patch).toHaveBeenCalledWith(
        mockProduct.ID,
        mockProduct
      );
    });
  });
});
