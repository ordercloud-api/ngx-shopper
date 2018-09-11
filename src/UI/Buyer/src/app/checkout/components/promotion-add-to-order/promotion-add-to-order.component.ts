import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Payment } from '@ordercloud/angular-sdk';

@Component({
  selector: 'checkout-payment-purchase-order',
  templateUrl: './promotion-add-to-order.component.html',
  styleUrls: ['./promotion-add-to-order.component.scss'],
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
