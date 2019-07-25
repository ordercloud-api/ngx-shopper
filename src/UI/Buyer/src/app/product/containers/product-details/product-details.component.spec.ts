import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA, InjectionToken } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

import { CartService, AppStateService } from '@app-buyer/shared';
import { ProductDetailsComponent } from '@app-buyer/product/containers/product-details/product-details.component';

import { CookieService, CookieModule } from 'ngx-cookie';
import {
  OcLineItemService,
  OcTokenService,
  OcOrderService,
  BuyerProduct,
  OcMeService,
} from '@ordercloud/angular-sdk';
import {
  applicationConfiguration,
  AppConfig,
} from '@app-buyer/config/app.config';
import { of } from 'rxjs';
import { FavoriteProductsService } from '@app-buyer/shared/services/favorites/favorites.service';
import { QuantityInputComponent } from '@app-buyer/shared/components/quantity-input/quantity-input.component';

describe('ProductDetailsComponent', () => {
  let component: ProductDetailsComponent;
  let fixture: ComponentFixture<ProductDetailsComponent>;

  const mockProductID = '41112-S000063105';
  const mockProduct = <BuyerProduct>{
    ID: mockProductID,
    xp: { RelatedProducts: [], additionalImages: [] },
  };

  const params = new BehaviorSubject<any>({ productID: mockProductID });
  const activatedRoute = {
    navigate: jasmine.createSpy('navigate'),
    params,
  };
  const router = { navigate: jasmine.createSpy('navigate') };
  const meService = {
    GetProduct: jasmine
      .createSpy('GetProduct')
      .and.returnValue(of(mockProduct)),
    ListSpecs: jasmine
      .createSpy('ListSpecs')
      .and.returnValue(of({ Items: [] })),
  };
  const ocLineItemService = {
    addToCart: jasmine.createSpy('addToCart').and.returnValue(of(null)),
    patch: jasmine.createSpy('patch').and.returnValue(of(null)),
  };
  const favoriteProductsService = {
    isFavorite: () => jasmine.createSpy('isFavorite').and.returnValue(true),
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProductDetailsComponent],
      imports: [CookieModule.forRoot(), HttpClientModule],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRoute },
        {
          provide: applicationConfiguration,
          useValue: new InjectionToken<AppConfig>('app.config'),
        },
        { provide: Router, useValue: router },
        AppStateService,
        CookieService,
        OcLineItemService,
        { provide: OcMeService, useValue: meService },
        { provide: CartService, useValue: ocLineItemService },
        {
          provide: FavoriteProductsService,
          useValue: favoriteProductsService,
        },
        OcOrderService,
        RouterTestingModule,
        OcTokenService,
      ],
      schemas: [NO_ERRORS_SCHEMA], // Ignore template errors: remove if tests are added to test template
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.quantityInputComponent = <QuantityInputComponent>{
      form: { value: { quantity: 1 } },
    };
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      spyOn(component, 'getProductData').and.returnValue(of(mockProduct));
      component.ngOnInit();
    });
    it('should call getProductData', () => {
      expect(component.getProductData).toHaveBeenCalled();
    });
  });

  describe('routeToProductList', () => {
    beforeEach(() => {
      component['routeToProductList']();
    });
    it('should navigate to the product list view', () => {
      expect(router.navigate).toHaveBeenCalledWith(['/products']);
    });
  });

  describe('getTotalPrice', () => {
    beforeEach(() => {
      component.product = {};
      component.product.PriceSchedule = {
        PriceBreaks: [
          { Quantity: 5, Price: 10 },
          { Quantity: 10, Price: 9 },
          { Quantity: 15, Price: 8 },
          { Quantity: 20, Price: 7 },
        ],
      };
    });
    it('should calculate total correctly without specs', () => {
      component.quantityInputComponent.form.value.quantity = 2;
      expect(component.getTotalPrice()).toEqual(2 * 10);
      component.quantityInputComponent.form.value.quantity = 7;
      expect(component.getTotalPrice()).toEqual(7 * 10);
      component.quantityInputComponent.form.value.quantity = 12;
      expect(component.getTotalPrice()).toEqual(12 * 9);
      component.quantityInputComponent.form.value.quantity = 15;
      expect(component.getTotalPrice()).toEqual(15 * 8);
      component.quantityInputComponent.form.value.quantity = 17;
      expect(component.getTotalPrice()).toEqual(17 * 8);
      component.quantityInputComponent.form.value.quantity = 20;
      expect(component.getTotalPrice()).toEqual(20 * 7);
      component.quantityInputComponent.form.value.quantity = 22;
      expect(component.getTotalPrice()).toEqual(22 * 7);
    });
  });
});
