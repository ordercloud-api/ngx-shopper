import { Component, Input } from '@angular/core';
import { ListPayment } from '@ordercloud/angular-sdk';

@Component({
  selector: 'order-payment-list',
  templateUrl: './payment-list.component.html',
  styleUrls: ['./payment-list.component.scss']
})
export class PaymentListComponent {
  @Input() payments: ListPayment;
}
