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
} from '@app/shared';
import { ProductDetailsComponent } from '@app/products/containers/product-details/product-details.component';

import { CookieService, CookieModule } from 'ngx-cookie';
import { LineItemService, TokenService, Configuration, OrderService, BuyerProduct, MeService } from '@ordercloud/angular-sdk';
import { applicationConfiguration, AppConfig } from '@app/config/app.config';
import { of } from 'rxjs';

describe('ProductDetailsComponent', () => {
  let component: ProductDetailsComponent;
  let fixture: ComponentFixture<ProductDetailsComponent>;

  const mockProductID = '41112-S000063105';
  const mockProduct = of(<BuyerProduct>{ ID: mockProductID, xp: { RelatedProducts: [], additionalImages: [] }});

  const queryParams = new BehaviorSubject<any>({ ID: mockProductID });
  const activatedRoute = { navigate: jasmine.createSpy('navigate'), queryParams };
  const meService = { GetProduct: jasmine.createSpy('GetProduct').and.returnValue(of(mockProduct)) };
  const ocLineItemService = { create: jasmine.createSpy('create').and.returnValue(of(null)) };

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
      spyOn(component, 'getProductData');
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
});
