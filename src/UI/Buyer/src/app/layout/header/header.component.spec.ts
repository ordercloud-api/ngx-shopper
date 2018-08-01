import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { HeaderComponent } from '@app-buyer/layout/header/header.component';
import {
  AppStateService,
  BaseResolveService,
  AppLineItemService,
} from '@app-buyer/shared';
import {
  OcTokenService,
  OcAuthService,
  OcMeService,
  OcLineItemService,
  OcSupplierService,
  OcOrderService,
} from '@ordercloud/angular-sdk';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbPopoverModule, NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap';
import { CookieModule } from 'ngx-cookie';
import {
  applicationConfiguration,
  AppConfig,
} from '@app-buyer/config/app.config';
import { InjectionToken, NO_ERRORS_SCHEMA } from '@angular/core';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  const mockOrder = { ID: 'orderID' };

  const ocTokenService = { RemoveAccess: jasmine.createSpy('RemoveAccess') };
  const baseResolveService = { resetUser: jasmine.createSpy('resetUser') };

  let appStateService: AppStateService;
  const router = { navigate: jasmine.createSpy('navigate'), url: '' };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      imports: [
        CookieModule.forRoot(),
        FontAwesomeModule,
        NgbPopoverModule,
        ReactiveFormsModule,
        HttpClientModule,
      ],
      schemas: [NO_ERRORS_SCHEMA], // Ignore template errors: remove if tests are added to test template
      providers: [
        OcAuthService,
        AppLineItemService,
        OcLineItemService,
        OcSupplierService,
        OcOrderService,
        OcMeService,
        NgbPopoverConfig,
        AppStateService,
        { provide: Router, useValue: router },
        { provide: BaseResolveService, useValue: baseResolveService },
        { provide: OcTokenService, useValue: ocTokenService },
        {
          provide: applicationConfiguration,
          useValue: new InjectionToken<AppConfig>('app.config'),
        },
      ],
    }).compileComponents();
    appStateService = TestBed.get(AppStateService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    component.alive = true;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      appStateService.orderSubject.next(mockOrder);
      spyOn(component, 'buildAddToCartNotification');
      component.ngOnInit();
    });
    it('should define currentOrder', () => {
      expect(component.currentOrder).toEqual(mockOrder);
    });
    it('should call buildAddToCartNotification', () => {
      expect(component.buildAddToCartNotification).toHaveBeenCalled();
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
});
