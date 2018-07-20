import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { InjectionToken } from '@angular/core';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CookieModule } from 'ngx-cookie';
import { of } from 'rxjs';
import {
  Configuration,
  OrderService,
  MeService,
} from '@ordercloud/angular-sdk';

import { CartComponent } from '@app/checkout/containers/cart/cart.component';
import {
  PageTitleComponent,
  PhoneFormatPipe,
  AppStateService,
  BaseResolveService,
  OcLineItemService,
} from '@app/shared';
import { OrderSummaryComponent } from '@app/checkout/components/order-summary/order-summary.component';
import { applicationConfiguration, AppConfig } from '@app/config/app.config';
import { LineItemCardComponent } from '@app/shared/components/line-item-card/line-item-card.component';
import { LineItemListWrapperComponent } from '@app/shared/components/lineitem-list-wrapper/lineitem-list-wrapper.component';
import { QuantityInputComponent } from '@app/shared/components/quantity-input/quantity-input.component';

describe('CartComponent', () => {
  let component: CartComponent;
  let fixture: ComponentFixture<CartComponent>;

  const ocLineItemService = {
    delete: jasmine.createSpy('delete').and.returnValue(of({})),
    patch: jasmine.createSpy('patch').and.returnValue(of({})),
  };
  const orderService = { Delete: jasmine.createSpy('Delete').and.returnValue(of({})) };
  const baseResolveService = { ResetUser: jasmine.createSpy('ResetUser').and.returnValue(of(true)) };
  const meService = { GetProduct: jasmine.createSpy('GetProduct').and.returnValue(of({})) };
  const appStateService = {
    orderSubject: of({}),
    lineItemSubject: of({ Items: [] })
  };



  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CartComponent,
        PageTitleComponent,
        OrderSummaryComponent,
        LineItemCardComponent,
        PhoneFormatPipe,
        LineItemListWrapperComponent,
        QuantityInputComponent,
      ],
      imports: [
        RouterTestingModule,
        ReactiveFormsModule,
        FontAwesomeModule,
        CookieModule.forRoot()
      ],
      providers: [
        { provide: AppStateService, useValue: appStateService },
        { provide: BaseResolveService, useValue: baseResolveService },
        { provide: OrderService, useValue: orderService },
        { provide: OcLineItemService, useValue: ocLineItemService },
        { provide: MeService, useValue: meService },
        { provide: applicationConfiguration, useValue: new InjectionToken<AppConfig>('app.config') }
      ]
    })
      .compileComponents();
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
