import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import { Order, OrderService, ListLineItem, ListPromotion, ListPayment } from '@ordercloud/angular-sdk';
import { OcLineItemService } from '@app/shared';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AppPaymentService } from '@app/shared/services/app-payment-service/app-payment.service';

@Component({
  selector: 'checkout-order-confirmation',
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.scss']
})
export class OrderConfirmationComponent implements OnInit {

  order$: Observable<Order>;
  lineItems$: Observable<ListLineItem>;
  promotions$: Observable<ListPromotion>;
  payments$: Observable<ListPayment>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private orderService: OrderService,
    private ocLineItemService: OcLineItemService,
    private appPaymentService: AppPaymentService
  ) { }

  ngOnInit() {
    this.order$ = this.getOrder();
    this.lineItems$ = this.getLineItems();
    this.promotions$ = this.getPromotions();
    this.payments$ = this.getPayments();
  }

  getOrder(): Observable<Order> {
    return this.activatedRoute.paramMap
      .pipe(
        flatMap((params: ParamMap) => this.orderService.Get('outgoing', params.get('orderID')))
      );
  }

  getLineItems(): Observable<ListLineItem> {
    return this.activatedRoute.paramMap
      .pipe(
        flatMap((params: ParamMap) => this.ocLineItemService.listAll(params.get('orderID')))
      );
  }

  getPromotions(): Observable<ListPromotion> {
    return this.activatedRoute.paramMap
      .pipe(
        flatMap((params: ParamMap) => this.orderService.ListPromotions('outgoing', params.get('orderID')))
      );
  }

  getPayments(): Observable<ListPayment> {
    return this.activatedRoute.paramMap
    .pipe(
      flatMap((params: ParamMap) => this.appPaymentService.getPayments('outgoing', params.get('orderID')))
    );
  }
}
