import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NO_ERRORS_SCHEMA, InjectionToken } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

import {
  PhoneFormatPipe,
  OcLineItemService,
  AppStateService
} from '@app-buyer/shared';
import { ProductDetailsComponent } from '@app-buyer/products/containers/product-details/product-details.component';

import { CookieService, CookieModule } from 'ngx-cookie';
import { LineItemService, TokenService, OrderService, BuyerProduct, MeService } from '@ordercloud/angular-sdk';
import { applicationConfiguration, AppConfig } from '@app-buyer/config/app.config';
import { of } from 'rxjs';
import { FavoriteProductsService } from '@app-buyer/shared/services/favorite-products/favorite-products.service';

describe('ProductDetailsComponent', () => {
  let component: ProductDetailsComponent;
  let fixture: ComponentFixture<ProductDetailsComponent>;

  const mockProductID = '41112-S000063105';
  const mockProduct = <BuyerProduct>{ ID: mockProductID, xp: { RelatedProducts: [], additionalImages: [] } };

  const queryParams = new BehaviorSubject<any>({ ID: mockProductID });
  const activatedRoute = { navigate: jasmine.createSpy('navigate'), queryParams };
  const meService = { GetProduct: jasmine.createSpy('GetProduct').and.returnValue(of(mockProduct)) };
  const ocLineItemService = { create: jasmine.createSpy('create').and.returnValue(of(null)) };
  const favoriteProductsService = {
    loadFavorites: jasmine.createSpy('loadFavorites'),
    isFavorite: jasmine.createSpy('isFavorite').and.returnValue(true)
  };

  beforeEach(
    async(() => {
      TestBed.configureTestingModule({
        declarations: [
          PhoneFormatPipe,
          ProductDetailsComponent
        ],
        imports: [
          CookieModule.forRoot(),
          HttpClientModule,
        ],
        providers: [
          { provide: ActivatedRoute, useValue: activatedRoute },
          { provide: applicationConfiguration, useValue: new InjectionToken<AppConfig>('app.config') },
          AppStateService,
          CookieService,
          LineItemService,
          { provide: MeService, useValue: meService },
          { provide: OcLineItemService, useValue: ocLineItemService },
          { provide: FavoriteProductsService, useValue: favoriteProductsService },
          OrderService,
          RouterTestingModule,
          TokenService,
        ],
        schemas: [NO_ERRORS_SCHEMA], // Ignore template errors: remove if tests are added to test template
      }).compileComponents();
    })
  );

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
    it('should call getProductData', () => {
      expect(component.getProductData).toHaveBeenCalled();
    });
  });

  describe('getProductData', () => {
    it('should call meService.getProduct', () => {
      component.getProductData();
      expect(meService.GetProduct).toHaveBeenCalled();
    });
  });

  describe('addToCart', () => {
    const mockQuantity = 3;
    const mockEmittedProduct = <BuyerProduct>{ id: 'MockProduct123' };
    beforeEach(() => {
      component.addToCart({ product: mockEmittedProduct, quantity: mockQuantity });
    });
    it('should call add to cart', () => {
      expect(ocLineItemService.create).toHaveBeenCalledWith(mockEmittedProduct, mockQuantity);
    });
  });

  describe('getTotalPrice', () => {
    beforeEach(() => {
      component.product.PriceSchedule = { PriceBreaks: [
        { Quantity: 5, Price: 10},
        { Quantity: 10, Price: 9},
        { Quantity: 15, Price: 8},
        { Quantity: 20, Price: 7},
      ]};
    });
    it('should calculate total correctly', () => {
      component.quantity = 2;
      expect(component.getTotalPrice()).toEqual(2 * 10);
      component.quantity = 7;
      expect(component.getTotalPrice()).toEqual(7 * 10);
      component.quantity = 12;
      expect(component.getTotalPrice()).toEqual(12 * 9);
      component.quantity = 15;
      expect(component.getTotalPrice()).toEqual(15 * 8);
      component.quantity = 17;
      expect(component.getTotalPrice()).toEqual(17 * 8);
      component.quantity = 20;
      expect(component.getTotalPrice()).toEqual(20 * 7);
      component.quantity = 22;
      expect(component.getTotalPrice()).toEqual(22 * 7);
    });
  });
});
