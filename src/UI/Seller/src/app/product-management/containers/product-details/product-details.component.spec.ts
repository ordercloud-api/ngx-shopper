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
  const mockProduct = { ID: 'myID', prevID: 'usedtobethis' };

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
    it('should update using prevID if defined', () => {
      const mock = { prevID: '1', ID: '2' };
      component.updateProduct(mock);
      expect(productService.Patch).toHaveBeenCalledWith(mock.prevID, mock);
    });
    it('should update using ID if no prevID', () => {
      const mock = { ID: '2' };
      component.updateProduct(mock);
      expect(productService.Patch).toHaveBeenCalledWith(mock.ID, mock);
    });
  });
});
