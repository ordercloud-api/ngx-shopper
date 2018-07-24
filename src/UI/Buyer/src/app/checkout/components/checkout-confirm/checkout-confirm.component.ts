import { Component, OnInit } from '@angular/core';
import { CheckoutSectionBaseComponent } from '@app-buyer/checkout/components/checkout-section-base/checkout-section-base.component';
import { AppStateService, OcLineItemService } from '@app-buyer/shared';
import { Order, ListPayment, ListLineItem } from '@ordercloud/angular-sdk';
import { Observable } from 'rxjs';
import { AppPaymentService } from '@app-buyer/shared/services/app-payment-service/app-payment.service';

@Component({
  selector: 'checkout-confirm',
  templateUrl: './checkout-confirm.component.html',
  styleUrls: ['./checkout-confirm.component.scss']
})
export class CheckoutConfirmComponent extends CheckoutSectionBaseComponent implements OnInit {
  order: Order;
  payments$: Observable<ListPayment>;
  lineItems$: Observable<ListLineItem>;

  constructor(
    private appStateService: AppStateService,
    private appPaymentService: AppPaymentService,
    private ocLineItemService: OcLineItemService
  ) {
    super();
  }

  ngOnInit() {
    this.order = this.appStateService.orderSubject.value;
    this.payments$ = this.appPaymentService.getPayments('outgoing', this.order.ID);
    this.lineItems$ = this.ocLineItemService.listAll(this.order.ID);
  }

}
