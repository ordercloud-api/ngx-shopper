import { Component, OnInit, Inject } from '@angular/core';
import { CheckoutSectionBaseComponent } from '@app/checkout/components/checkout-section-base/checkout-section-base.component';
import { AppStateService, OcLineItemService } from '@app/shared';
import { Order, ListPayment, ListLineItem, OrderService } from '@ordercloud/angular-sdk';
import { Observable } from 'rxjs';
import { AppPaymentService } from '@app/shared/services/app-payment-service/app-payment.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { applicationConfiguration, AppConfig } from '@app/config/app.config';

@Component({
  selector: 'checkout-confirm',
  templateUrl: './checkout-confirm.component.html',
  styleUrls: ['./checkout-confirm.component.scss']
})
export class CheckoutConfirmComponent extends CheckoutSectionBaseComponent implements OnInit {
  form: FormGroup;
  order: Order;
  payments$: Observable<ListPayment>;
  lineItems$: Observable<ListLineItem>;

  constructor(
    private appStateService: AppStateService,
    private appPaymentService: AppPaymentService,
    private ocLineItemService: OcLineItemService,
    private formBuilder: FormBuilder,
    private orderService: OrderService,
    @Inject(applicationConfiguration) private appConfig: AppConfig
  ) {
    super();
  }

  ngOnInit() {
    if (!this.appConfig.anonymousShoppingEnabled) {
      this.form = this.formBuilder.group({ comments: ''});
    }
    this.order = this.appStateService.orderSubject.value;
    this.payments$ = this.appPaymentService.getPayments('outgoing', this.order.ID);
    this.lineItems$ = this.ocLineItemService.listAll(this.order.ID);
  }

  saveComments() {
    this.order.Comments = this.form.get('comments').value;
    this.orderService.Patch('outgoing', this.order.ID, this.order).subscribe(order => {
      this.appStateService.orderSubject.next(order);
      this.continue.emit();
    });
  }

}
