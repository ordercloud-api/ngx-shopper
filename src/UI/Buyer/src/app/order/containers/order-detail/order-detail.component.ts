import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map, flatMap } from 'rxjs/operators';
import {
  Order,
  ListLineItem,
  ListPromotion,
  OcOrderService,
  ListPayment,
  Address,
  OrderApproval,
} from '@ordercloud/angular-sdk';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AppLineItemService } from '@app-buyer/shared';
import { AppPaymentService } from '@app-buyer/shared/services/app-payment-service/app-payment.service';
import { uniqBy as _uniqBy } from 'lodash';

@Component({
  selector: 'order-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss'],
})
export class OrderDetailComponent implements OnInit {
  order$: Observable<Order>;
  lineItems$: Observable<ListLineItem>;
  promotions$: Observable<ListPromotion>;
  supplierAddresses$: Observable<Address[]>;
  lineItems: ListLineItem;
  payments$: Observable<ListPayment>;
  approvals$: Observable<OrderApproval[]>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private orderService: OcOrderService,
    private ocLineItemService: AppLineItemService,
    private appPaymentService: AppPaymentService
  ) {}

  ngOnInit() {
    this.order$ = this.activatedRoute.parent.data.pipe(
      map(({ orderResolve }) => orderResolve.order)
    );
    this.lineItems$ = this.activatedRoute.parent.data.pipe(
      map(({ orderResolve }) => orderResolve.lineItems)
    );
    this.promotions$ = this.getPromotions();
    this.supplierAddresses$ = this.getSupplierAddresses();
    this.payments$ = this.getPayments();
    this.approvals$ = this.getApprovals();
  }

  private getPromotions() {
    return this.activatedRoute.paramMap.pipe(
      flatMap((params: ParamMap) =>
        this.orderService.ListPromotions('outgoing', params.get('orderID'))
      )
    );
  }

  private getSupplierAddresses(): Observable<Address[]> {
    return this.lineItems$.pipe(
      flatMap((lineItems) =>
        this.ocLineItemService.getSupplierAddresses(lineItems)
      )
    );
  }

  getPayments(): Observable<ListPayment> {
    return this.activatedRoute.paramMap.pipe(
      flatMap((params: ParamMap) =>
        this.appPaymentService.getPayments('outgoing', params.get('orderID'))
      )
    );
  }

  getApprovals(): Observable<OrderApproval[]> {
    return this.activatedRoute.paramMap.pipe(
      flatMap((params: ParamMap) =>
        this.orderService.ListApprovals('outgoing', params.get('orderID'))
      ),
      map((list) => _uniqBy(list.Items, (x) => x.Comments))
    );
  }
}
