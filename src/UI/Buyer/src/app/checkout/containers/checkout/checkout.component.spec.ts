import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutComponent } from './checkout.component';
import {
  PageTitleComponent,
  PhoneFormatPipe,
  AppStateService,
  BaseResolveService,
  AuthorizeNetService
} from '@app/shared';
import { OrderSummaryComponent } from '@app/checkout/components/order-summary/order-summary.component';
import { NgbAccordion, NgbPanel, NgbAccordionModule, NgbModule, NgbAccordionConfig } from '@ng-bootstrap/ng-bootstrap';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CheckoutAddressComponent } from '@app/checkout/containers/checkout/checkout-address/checkout-address.component';
import { CheckoutPaymentComponent } from '@app/checkout/containers/checkout/checkout-payment/checkout-payment.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AddressFormComponent } from '@app/shared/components/address-form/address-form.component';
import { CreditCardDisplayComponent } from '@app/shared/components/credit-card-display/credit-card-display.component';
import { CreditCardFormComponent } from '@app/shared/components/credit-card-form/credit-card-form.component';
import { LineItemCardComponent } from '@app/shared/components/line-item-card/line-item-card.component';
import { RouterTestingModule } from '@angular/router/testing';
import { of, BehaviorSubject } from 'rxjs';
import { OrderService, PaymentService } from '@ordercloud/angular-sdk';
import { QuantityInputComponent } from '@app/shared/components/quantity-input/quantity-input.component';

describe('CheckoutComponent', () => {
  let component: CheckoutComponent;
  let fixture: ComponentFixture<CheckoutComponent>;
  const appStateService = {
    orderSubject: new BehaviorSubject({ ID: 'someorderid', LineItemCount: 1 }),
    isAnonSubject: new BehaviorSubject(false)
  };
  const orderService = { Submit: jasmine.createSpy('Submit').and.returnValue(of(null)) };
  const authNetService = { CaptureTransaction: jasmine.createSpy('CaptureTransaction').and.returnValue(of(null)) };
  const paymentService = { List: jasmine.createSpy('List').and.returnValue(of({ Items: [{ ID: 'paymentID' }] })) };
  const baseResolveService = { resetUser: jasmine.createSpy('restUser').and.returnValue(null) };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
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
        { provide: AuthorizeNetService, useValue: authNetService },
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
    it('should setup correctly for known users', () => {
      component.ngOnInit();
      expect(component.isAnon).toEqual(false);
      expect(component.currentPanel).toEqual('address');
      expect(component.sections.find(x => x.id === 'login').valid).toEqual(true);
    });
  });

  describe('getValidation()', () => {
    it('should get validation for section', () => {
      expect(component.sections.find(x => x.id === 'login').valid).toEqual(component.getValidation('login'));
      expect(component.sections.find(x => x.id === 'address').valid).toEqual(component.getValidation('address'));
      expect(component.sections.find(x => x.id === 'payment').valid).toEqual(component.getValidation('payment'));
    });
  });

  describe('setValidation()', () => {
    it('should get validation for section', () => {
      component.setValidation('login', true);
      expect(component.sections.find(x => x.id === 'login').valid).toEqual(true);
      component.setValidation('address', false);
      expect(component.sections.find(x => x.id === 'address').valid).toEqual(false);
      component.setValidation('payment', false);
      expect(component.sections.find(x => x.id === 'payment').valid).toEqual(false);
    });
  });

  describe('toSection()', () => {
    it('should go to a valid section', () => {
      component.setValidation('address', true);
      component.currentPanel = 'address';

      component.toSection('payment');
      fixture.detectChanges();

      expect(component.currentPanel).toEqual('payment');
    });
  });

  describe('confirmOrder()', () => {
    it('should call necessary services', () => {
      component.confirmOrder();
      expect(authNetService.CaptureTransaction).toHaveBeenCalled();
      expect(orderService.Submit).toHaveBeenCalled();
      expect(baseResolveService.resetUser).toHaveBeenCalled();
    });
  });
});
