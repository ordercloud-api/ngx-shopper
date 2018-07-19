import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map, flatMap } from 'rxjs/operators';
import {
  Order,
  ListLineItem,
  ListPromotion,
  OrderService,
  ListPayment,
  Address
} from '@ordercloud/angular-sdk';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { OcLineItemService } from '@app/shared';
import { AppPaymentService } from '@app/shared/services/app-payment-service/app-payment.service';

@Component({
  selector: 'order-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit {

  order$: Observable<Order>;
  lineItems$: Observable<ListLineItem>;
  promotions$: Observable<ListPromotion>;
  supplierAddresses$: Observable<Address[]>;
  lineItems: ListLineItem;
  payments$: Observable<ListPayment>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private orderService: OrderService,
    private ocLineItemService: OcLineItemService,
    private appPaymentService: AppPaymentService
  ) { }

  ngOnInit() {
    this.order$ = this.activatedRoute.parent.data
      .pipe(
        map(({ orderResolve }) => orderResolve.order)
      );
    this.lineItems$ = this.activatedRoute.parent.data
      .pipe(
        map(({ orderResolve }) => orderResolve.lineItems)
      );
    this.promotions$ = this.getPromotions();
    this.supplierAddresses$ = this.getSupplierAddresses();
    this.payments$ = this.getPayments();
  }

  private getPromotions() {
    return this.activatedRoute.paramMap
      .pipe(
        flatMap((params: ParamMap) => this.orderService.ListPromotions('outgoing', params.get('orderID')))
      );
  }

  private getSupplierAddresses(): Observable<Address[]> {
    return this.lineItems$
      .pipe(
        flatMap(lineItems => this.ocLineItemService.getSupplierAddresses(lineItems))
      );
  }

  getPayments(): Observable<ListPayment> {
    return this.activatedRoute.paramMap
      .pipe(
        flatMap((params: ParamMap) => this.appPaymentService.getPayments('outgoing', params.get('orderID')))
      );
  }
}
