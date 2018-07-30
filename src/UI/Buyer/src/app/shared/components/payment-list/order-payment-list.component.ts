import { Component, Input } from '@angular/core';
import { ListPayment } from '@ordercloud/angular-sdk';

@Component({
  selector: 'order-payment-list',
  templateUrl: './order-payment-list.component.html',
  styleUrls: ['./order-payment-list.component.scss'],
})
export class OrderPaymentListComponent {
  @Input() payments: ListPayment;
}
