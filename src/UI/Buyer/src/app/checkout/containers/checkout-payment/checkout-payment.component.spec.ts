import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutPaymentComponent } from './checkout-payment.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ReactiveFormsModule } from '@angular/forms';
import { CreditCardFormComponent } from '@app/shared/components/credit-card-form/credit-card-form.component';
import { CreditCardDisplayComponent } from '@app/shared/components/credit-card-display/credit-card-display.component';
import { PaymentService, Payment } from '@ordercloud/angular-sdk';
import { AppStateService } from '@app/shared';
import { of } from 'rxjs';
import { applicationConfiguration } from '@app/config/app.config';
import { PaymentMethodDisplayPipe } from '@app/shared/pipes/payment-method-display/payment-method-display.pipe';
import { PaymentPurchaseOrderComponent } from '@app/checkout/components/payment-purchase-order/payment-purchase-order.component';
import { PaymentMethod } from '@app/shared/models/payment-method.enum';
import { delay } from 'rxjs/operators';

describe('CheckoutPaymentComponent', () => {
  let component: CheckoutPaymentComponent;
  let fixture: ComponentFixture<CheckoutPaymentComponent>;
  let mockPayments = <Payment[]>[{ CreditCardID: '1', Type: 'CreditCard' }];
  const mockOrder = { ID: '1', xp: { cardDetails: { CardholderName: 'test' } } };
  const appStateService = { orderSubject: { value: mockOrder } };
  const paymentService = {
    List: jasmine.createSpy('List').and.callFake(() => of({ Items: mockPayments })),
    Delete: jasmine.createSpy('Delete').and.returnValue(of(null)),
    Create: jasmine.createSpy('Create').and.callFake((...myArgs) => of(myArgs[2]).pipe(delay(0))),
    Patch: jasmine.createSpy('Patch').and.callFake((...myArgs) => of(myArgs[3]).pipe(delay(0))),
  };
  const appConfig = {
    availablePaymentMethods: ['PurchaseOrder', 'CreditCard']
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PaymentPurchaseOrderComponent,
        PaymentMethodDisplayPipe,
        CheckoutPaymentComponent,
        CreditCardDisplayComponent,
        CreditCardFormComponent
      ],
      imports: [
        FontAwesomeModule,
        ReactiveFormsModule
      ],
      providers: [
        { provide: AppStateService, useValue: appStateService },
        { provide: PaymentService, useValue: paymentService },
        { provide: applicationConfiguration, useValue: appConfig },
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutPaymentComponent);
    component = fixture.componentInstance;
    component.isAnon = true;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      spyOn(component, 'initializePaymentMethod');
      component.ngOnInit();
    });
    it('should call initializePaymentMethod', () => {
      expect(component.initializePaymentMethod).toHaveBeenCalled();
    });
    it('should set form', () => {
      expect(component.form.value).toEqual({
        selectedPaymentMethod: ''
      });
    });
  });

  describe('initializePaymentMethod', () => {
    beforeEach(() => {
      fixture.detectChanges();
      spyOn(component, 'selectPaymentMethod');
    });
    it('should call paymentService.List', () => {
      fixture.detectChanges();
      component.initializePaymentMethod();
      fixture.detectChanges();
      expect(paymentService.List).toHaveBeenCalledWith('outgoing', '1');
      fixture.detectChanges();
    });
    it('should use existing payment method if payment exists', () => {
      mockPayments = [{ Type: 'CreditCard' }];
      component.initializePaymentMethod();
      expect(component.selectPaymentMethod).toHaveBeenCalledWith('CreditCard');
    });
    it('should use first available payment method if no payment exists', () => {
      mockPayments = [];
      component.initializePaymentMethod();
      expect(component.selectPaymentMethod).toHaveBeenCalledWith('PurchaseOrder');
    });
  });

  describe('selectPaymentMethod', () => {
    beforeEach(() => {
      component.form.controls['selectedPaymentMethod'].setValue('');
      component.selectedPaymentMethod = null;
      component.selectPaymentMethod(PaymentMethod.CreditCard);
    });
    it('should set form with method', () => {
      expect(component.form.controls['selectedPaymentMethod'].value).toBe('CreditCard');
    });
    it('should set selectedPaymentMethod with method', () => {
      expect(component.selectedPaymentMethod).toBe('CreditCard');
    });
  });

  describe('onContinueClicked', () => {
    beforeEach(() => {
      spyOn(component.continue, 'emit');
      component.onContinueClicked();
    });
    it('should emit continue event', () => {
      expect(component.continue.emit).toHaveBeenCalled();
    });
  });

  describe('createPayment', () => {
    beforeEach(() => {
      mockPayments = [{}];
      spyOn(component as any, 'deleteExistingPayments').and.returnValue(of(null));
      component.createPayment({ID: 'MockPayment'});
    });
    it('should call deleteExistingPayments', () => {
      expect(component['deleteExistingPayments']).toHaveBeenCalled();
    });
    it('should call paymentService.Create', () => {
      expect(paymentService.Create).toHaveBeenCalledWith('outgoing', '1', {ID: 'MockPayment'});
    });
  });

  describe('deleteExistingPayments', () => {
    beforeEach(() => {
      paymentService.Delete.calls.reset();
      mockPayments = [{ID: 'CCPayment', Type: 'CreditCard'}, {ID: 'POPayment', Type: 'PurchaseOrder'}];
      component['deleteExistingPayments']().subscribe();
    });
    it('should list payments', () => {
      expect(paymentService.List).toHaveBeenCalledWith('outgoing', '1');
    });
    it('should call delete for each payment', () => {
      expect(paymentService.Delete).toHaveBeenCalledWith('outgoing', '1', 'CCPayment');
      expect(paymentService.Delete).toHaveBeenCalledWith('outgoing', '1', 'POPayment');
      expect(paymentService.Delete).toHaveBeenCalledTimes(2);
    });
  });

  describe('patchPayment', () => {
    beforeEach(() => {
      component.patchPayment({paymentID: 'mockPOPaymentID', payment: {xp: {PONumber: 'new po number'}}});
    });
    it('should patch the payment', () => {
      expect(paymentService.Patch).toHaveBeenCalledWith('outgoing', '1', 'mockPOPaymentID', {xp: {PONumber: 'new po number'}});
    });
  });
});
