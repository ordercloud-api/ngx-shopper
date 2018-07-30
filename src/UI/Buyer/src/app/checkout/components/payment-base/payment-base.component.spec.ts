import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentBaseComponent } from '@app-buyer/checkout/components/payment-base/payment-base.component';

describe('PaymentBaseComponent', () => {
  let component: PaymentBaseComponent;
  let fixture: ComponentFixture<PaymentBaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentBaseComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('paymentValid', () => {
    it('should be invalid if payment is less than order total', () => {
      component.payment = { Amount: 10 };
      component.order = { Total: 30 };
      const valid = component.paymentValid();
      expect(valid).toBe(false);
    });
    it('should be invalid if payment is greater than order total', () => {
      component.payment = { Amount: 30 };
      component.order = { Total: 10 };
      const valid = component.paymentValid();
      expect(valid).toBe(false);
    });
    it('should be valid if payment is equal to order total', () => {
      component.payment = { Amount: 10 };
      component.order = { Total: 10 };
      const valid = component.paymentValid();
      expect(valid).toBe(true);
    });
  });
});
