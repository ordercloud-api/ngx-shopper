import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { HeaderComponent } from '@app/layout/header/header.component';
import {
  AppStateService,
  NavBrandsPipe,
  BaseResolveService,
  OcLineItemService
} from '@app/shared';
import {
  TokenService,
  Configuration,
  AuthService,
  MeService,
  LineItemService,
  SupplierService,
  OrderService,
  Order
} from '@ordercloud/angular-sdk';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbPopoverModule, NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap';
import { CookieModule } from 'ngx-cookie';
import { applicationConfiguration, AppConfig } from '@app/config/app.config';
import { InjectionToken, NO_ERRORS_SCHEMA } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  const orderSubject$ = new BehaviorSubject<Order>(null);

  const ocTokenService = { RemoveAccess: jasmine.createSpy('RemoveAccess') };
  const baseResolveService = { resetUser: jasmine.createSpy('resetUser') };

  let appStateService: AppStateService;
  const router = { navigate: jasmine.createSpy('navigate'), url: '' };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderComponent, NavBrandsPipe],
      imports: [
        CookieModule.forRoot(),
        FontAwesomeModule,
        NgbPopoverModule,
        ReactiveFormsModule,
        HttpClientModule,
      ],
      schemas: [NO_ERRORS_SCHEMA], // Ignore template errors: remove if tests are added to test template
      providers: [
        AuthService,
        OcLineItemService,
        LineItemService,
        SupplierService,
        OrderService,
        MeService,
        NgbPopoverConfig,
        AppStateService,
        { provide: Router, useValue: router },
        { provide: BaseResolveService, useValue: baseResolveService },
        { provide: TokenService, useValue: ocTokenService },
        { provide: applicationConfiguration, useValue: new InjectionToken<AppConfig>('app.config') }
      ]
    })
      .compileComponents();
    appStateService = TestBed.get(AppStateService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      component.popover = fixture.componentInstance.popover;
      component.currentOrder = { LineItemCount: 0 };
      spyOn(component, 'addedToCart');
      component.ngOnInit();
    });
    it('should call added to cart if line item count has changed', () => {
      appStateService.orderSubject.next({ LineItemCount: 1 });
      appStateService.orderSubject.next({ LineItemCount: 2 });
      appStateService.orderSubject.subscribe(order => {
        expect(order.LineItemCount).toBe(2);
        expect(component.addedToCart).toHaveBeenCalled();
      });
    });
    it('should not call added to cart if line item count is the same', () => {
      appStateService.orderSubject.next({ LineItemCount: 1 });
      appStateService.orderSubject.next({ LineItemCount: 1 });
      appStateService.orderSubject.subscribe(order => {
        expect(order.LineItemCount).toBe(1);
        expect(component.addedToCart).not.toHaveBeenCalled();
      });
    });
  });

  describe('search', () => {
    const mockSearchTerm = 'awesome product';
    beforeEach(() => {
      component.searchProductsForm.value.search = mockSearchTerm;
      component.searchProducts(mockSearchTerm);
    });
    it('should navigate to product list component with correct query parameters', () => {
      expect(router.navigate).toHaveBeenCalledWith(['/products'], { queryParams: { search: mockSearchTerm } });
    });
  });

  describe('logout', () => {
    beforeEach(() => {
      router.navigate.calls.reset();
    });
    it('should remove token', () => {
      component.logout();
      expect(ocTokenService.RemoveAccess).toHaveBeenCalled();
    });
    it('should refresh current user if user is anonymous', () => {
      appStateService.isAnonSubject.next(true);
      component.logout();
      expect(baseResolveService.resetUser).toHaveBeenCalled();
    });
    it('should route to login if user is profiled', () => {
      appStateService.isAnonSubject.next(false);
      component.logout();
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('addedToCart', () => {
    beforeEach(() => {
      spyOn(component.popover, 'open');
      spyOn(component.popover, 'close');
    });
    it('should open popover and close it after 5 seconds', fakeAsync(() => {
      component.addedToCart();
      expect(component.popover.open).toHaveBeenCalled();
      tick(4500);
      expect(component.popover.close).not.toHaveBeenCalled();
      tick(500);
      expect(component.popover.close).toHaveBeenCalled();
    }));
  });
});
