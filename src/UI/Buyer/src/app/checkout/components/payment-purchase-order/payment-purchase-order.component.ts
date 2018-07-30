import { Component, OnChanges, SimpleChanges } from '@angular/core';
import { PaymentBaseComponent } from '@app-buyer/checkout/components/payment-base/payment-base.component';
import { FormBuilder, FormGroup } from '@angular/forms';
import { get as _get } from 'lodash';
import { Payment } from '@ordercloud/angular-sdk';

@Component({
  selector: 'checkout-payment-purchase-order',
  templateUrl: './payment-purchase-order.component.html',
  styleUrls: ['./payment-purchase-order.component.scss'],
})
export class PaymentPurchaseOrderComponent extends PaymentBaseComponent
  implements OnChanges {
  form: FormGroup = this.formBuilder.group({
    PONumber: _get(this.payment, 'xp.PONumber'),
  });
  constructor(private formBuilder: FormBuilder) {
    super();
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes.payment) {
      this.payment = changes.payment.currentValue;
    }
    if (changes.order) {
      this.order = changes.order.currentValue;
    }
    if (changes.payment || changes.order) {
      // set form
      if (changes.payment.firstChange) {
        this.form.controls['PONumber'].setValue(
          _get(this.payment, 'xp.PONumber')
        );
      }

      // validate payment
      if (!this.paymentValid()) {
        this.createNewPayment();
      }
    }
  }

  createNewPayment() {
    const payment: Payment = {
      Type: 'PurchaseOrder',
      xp: {
        // preserve PO number if it existed on previous payment
        PONumber: _get(this.payment, 'xp.PONumber'),
      },
    };
    this.paymentCreated.emit(payment);
  }

  updatePONumber() {
    const PONumber = this.form.controls['PONumber'].value;
    this.paymentPatched.emit({
      paymentID: this.payment.ID,
      payment: {
        xp: {
          PONumber,
        },
      },
    });
  }

  validateAndContinue() {
    if (this.paymentValid) {
      this.continue.emit();
    }
  }
}
