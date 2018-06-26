import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutComponent } from './checkout.component';
import {
  PageTitleComponent,
  PhoneFormatPipe,
  AppStateService,
  BaseResolveService,
} from '@app/shared';
import { OrderSummaryComponent } from '@app/checkout/components/order-summary/order-summary.component';
import { NgbAccordion, NgbPanel, NgbAccordionConfig } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CheckoutAddressComponent } from '@app/checkout/containers/checkout-address/checkout-address.component';
import { CheckoutPaymentComponent } from '@app/checkout/containers/checkout-payment/checkout-payment.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AddressFormComponent } from '@app/shared/components/address-form/address-form.component';
import { CreditCardDisplayComponent } from '@app/shared/components/credit-card-display/credit-card-display.component';
import { CreditCardFormComponent } from '@app/shared/components/credit-card-form/credit-card-form.component';
import { LineItemCardComponent } from '@app/shared/components/line-item-card/line-item-card.component';
import { RouterTestingModule } from '@angular/router/testing';
import { of, BehaviorSubject } from 'rxjs';
import { OrderService, PaymentService } from '@ordercloud/angular-sdk';
import { QuantityInputComponent } from '@app/shared/components/quantity-input/quantity-input.component';
import { PaymentMethodDisplayPipe } from '@app/shared/pipes/payment-method-display/payment-method-display.pipe';
import { PaymentPurchaseOrderComponent } from '@app/checkout/components/payment-purchase-order/payment-purchase-order.component';

describe('CheckoutComponent', () => {
  let component: CheckoutComponent;
  let fixture: ComponentFixture<CheckoutComponent>;
  const appStateService = {
    orderSubject: new BehaviorSubject({ ID: 'someorderid', LineItemCount: 1 }),
    isAnonSubject: new BehaviorSubject(false)
  };
  const orderService = { Submit: jasmine.createSpy('Submit').and.returnValue(of(null)) };
  const paymentService = { List: jasmine.createSpy('List').and.returnValue(of({ Items: [{ ID: 'paymentID' }] })) };
  const baseResolveService = { resetUser: jasmine.createSpy('restUser').and.returnValue(null) };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PaymentPurchaseOrderComponent,
        PaymentMethodDisplayPipe,
        CheckoutComponent,
        PageTitleComponent,
        OrderSummaryComponent,
        NgbAccordion,
        NgbPanel,
        CheckoutAddressComponent,
        CheckoutPaymentComponent,
        AddressFormComponent,
        CreditCardDisplayComponent,
        CreditCardFormComponent,
        PhoneFormatPipe,
        LineItemCardComponent,
        QuantityInputComponent,
      ],
      imports: [
        FontAwesomeModule,
        ReactiveFormsModule,
        RouterTestingModule,
      ],
      providers: [
        NgbAccordionConfig,
        { provide: AppStateService, useValue: appStateService },
        { provide: OrderService, useValue: orderService },
        { provide: PaymentService, useValue: paymentService },
        { provide: BaseResolveService, useValue: baseResolveService },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    beforeEach(() => {
      spyOn(component, 'setValidation');
    })
    it('should set panel to shippingAddress if user is profiled', () => {
      appStateService.isAnonSubject.next(false);
      component.ngOnInit();
      expect(component.currentPanel).toEqual('shippingAddress');
    });
    it('should validate login panel if user is profiled', () => {
      appStateService.isAnonSubject.next(false);
      component.ngOnInit();
      expect(component.setValidation).toHaveBeenCalledWith('login', true);
    })
    it('should set panel to login if user is anonymous', () => {
      appStateService.isAnonSubject.next(true);
      component.ngOnInit();
      component.currentPanel = 'login';
    })
    it('should invalidate login panel if user is anonymous', () => {
      appStateService.isAnonSubject.next(true);
      component.ngOnInit();
      expect(component.setValidation).toHaveBeenCalledWith('login', false);
    })
  });

  describe('getValidation()', () => {
    beforeEach(() => {
      component.sections = [
        {
          id: 'login',
          valid: true
        },
        {
          id: 'shippingAddress',
          valid: true
        },
        {
          id: 'billingAddress',
          valid: false
        },
        {
          id: 'payment',
          valid: false
        },
        {
          id: 'confirm',
          valid: false
        }
      ];
    })
    it('should get validation for section', () => {
      component.sections.forEach(section => {
        expect(component.getValidation(section.id)).toBe(section.valid);
      });
    });
  });

  describe('setValidation()', () => {
    it('should get validation for section', () => {
      component.setValidation('login', true);
      expect(component.sections.find(x => x.id === 'login').valid).toEqual(true);
      component.setValidation('shippingAddress', false);
      expect(component.sections.find(x => x.id === 'shippingAddress').valid).toEqual(false);
      component.setValidation('payment', false);
      expect(component.sections.find(x => x.id === 'payment').valid).toEqual(false);
    });
  });

  describe('toSection()', () => {
    it('should go to a valid section', () => {
      // validate previous panels
      component.setValidation('login', true);
      component.setValidation('shippingAddress', true);
      component.currentPanel = 'billingAddress';

      component.toSection('payment');
      fixture.detectChanges();

      expect(component.currentPanel).toEqual('payment');
    });
  });

  describe('confirmOrder()', () => {
    it('should call necessary services', () => {
      component.confirmOrder();
      expect(orderService.Submit).toHaveBeenCalled();
      expect(baseResolveService.resetUser).toHaveBeenCalled();
    });
  });
});
