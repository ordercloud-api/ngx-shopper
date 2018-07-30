import { Component, Input, EventEmitter, Output } from '@angular/core';
import { Payment, Order, PartialPayment } from '@ordercloud/angular-sdk';
import { PaymentMethod } from '@app-buyer/shared/models/payment-method.enum';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'checkout-payment-base',
  template: '',
  styleUrls: ['./payment-base.component.scss'],
})
export class PaymentBaseComponent {
  @Input() order: Order;
  @Input() payment: Payment;
  @Input() paymentMethod: PaymentMethod;
  @Output() paymentCreated = new EventEmitter<Payment>();
  @Output()
  paymentPatched = new EventEmitter<{
    paymentID: string;
    payment: PartialPayment;
  }>();
  @Output() continue = new EventEmitter();
  form: FormGroup;

  constructor() {}

  paymentValid() {
    return !!this.payment && this.payment.Amount === this.order.Total;
  }
}
