import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentPurchaseOrderComponent } from '@app-buyer/checkout/components/payment-purchase-order/payment-purchase-order.component';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';

describe('PaymentPurchaseOrderComponent', () => {
  let component: PaymentPurchaseOrderComponent;
  let fixture: ComponentFixture<PaymentPurchaseOrderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentPurchaseOrderComponent],
      imports: [ReactiveFormsModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentPurchaseOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.form = new FormGroup({
      PONumber: new FormControl(''),
    });
    component.payment = {
      Amount: 20,
    };
    component.order = {
      Total: 20,
    };
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('newPayment', () => {
    beforeEach(() => {
      spyOn(component.paymentCreated, 'emit');
    });
    it('should emit paymentCreated event with purchase order payment', () => {
      component.payment = { xp: { PONumber: 'PreviousPONumber' } };
      component.createNewPayment();
      expect(component.paymentCreated.emit).toHaveBeenCalledWith({
        Type: 'PurchaseOrder',
        xp: { PONumber: 'PreviousPONumber' },
      });
    });
  });

  describe('updatePONumber', () => {
    beforeEach(() => {
      spyOn(component.paymentPatched, 'emit');
    });
    it('should emit paymentUpdated event with partial purchase order', () => {
      component.payment = {
        ID: 'MockPaymentID',
        xp: { PONumber: 'PreviousPONumber' },
      };
      component.form.controls['PONumber'].setValue('NewPoNumber');
      component.updatePONumber();
      const expectedResult = {
        paymentID: 'MockPaymentID',
        payment: { xp: { PONumber: 'NewPoNumber' } },
      };
      expect(component.paymentPatched.emit).toHaveBeenCalledWith(
        expectedResult
      );
    });
  });
});
