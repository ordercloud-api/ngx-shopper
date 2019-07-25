import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { InjectionToken, NO_ERRORS_SCHEMA } from '@angular/core';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CookieModule } from 'ngx-cookie';
import { of } from 'rxjs';
import { OcOrderService, OcMeService } from '@ordercloud/angular-sdk';

import { CartComponent } from '@app-buyer/checkout/containers/cart/cart.component';
import {
  AppStateService,
  BaseResolveService,
  CartService,
} from '@app-buyer/shared';
import {
  applicationConfiguration,
  AppConfig,
} from '@app-buyer/config/app.config';

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;

  const ocLineItemService = {
    delete: jasmine.createSpy('delete').and.returnValue(of({})),
    patch: jasmine.createSpy('patch').and.returnValue(of({})),
  };
  const orderService = {
    Delete: jasmine.createSpy('Delete').and.returnValue(of({})),
  };
  const baseResolveService = {
    ResetUser: jasmine.createSpy('ResetUser').and.returnValue(of(true)),
  };
  const meService = {
    GetProduct: jasmine.createSpy('GetProduct').and.returnValue(of({})),
  };
  const appStateService = {
    orderSubject: of({}),
    lineItemSubject: of({ Items: [] }),
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CartComponent],
      imports: [
        RouterTestingModule,
        ReactiveFormsModule,
        FontAwesomeModule,
        CookieModule.forRoot(),
      ],
      providers: [
        { provide: AppStateService, useValue: appStateService },
        { provide: BaseResolveService, useValue: baseResolveService },
        { provide: OcOrderService, useValue: orderService },
        { provide: CartService, useValue: ocLineItemService },
        { provide: OcMeService, useValue: meService },
        {
          provide: applicationConfiguration,
          useValue: new InjectionToken<AppConfig>('app.config'),
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CartComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
