import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {
  Order,
  ListLineItem,
  ListPromotion,
  OcOrderService,
  ListPayment,
  OrderApproval,
} from '@ordercloud/angular-sdk';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AppPaymentService } from '@app-buyer/shared/services/app-payment-service/app-payment.service';
import { uniqBy as _uniqBy } from 'lodash';

@Component({
  selector: 'order-details',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss'],
})
export class OrderDetailsComponent implements OnInit {
  orderID: string;
  order$: Observable<Order>;
  lineItems$: Observable<ListLineItem>;
  promotions$: Observable<ListPromotion>;
  payments$: Observable<ListPayment>;
  approvals$: Observable<OrderApproval[]>;

  constructor(
    protected activatedRoute: ActivatedRoute,
    protected ocOrderService: OcOrderService,
    protected appPaymentService: AppPaymentService
  ) {}

  ngOnInit() {
    this.order$ = this.activatedRoute.data.pipe(
      map(({ orderResolve }) => orderResolve.order)
    );
    this.lineItems$ = this.activatedRoute.data.pipe(
      map(({ orderResolve }) => orderResolve.lineItems)
    );
    this.activatedRoute.paramMap.subscribe((params: ParamMap) => {
      this.orderID = params.get('orderID');
      this.promotions$ = this.getPromotions();
      this.payments$ = this.getPayments();
      this.approvals$ = this.getApprovals();
    });
  }

  protected getPromotions(): Observable<ListPromotion> {
    return (this.promotions$ = this.ocOrderService.ListPromotions(
      'outgoing',
      this.orderID
    ));
  }

  protected getPayments(): Observable<ListPayment> {
    return this.appPaymentService.getPayments('outgoing', this.orderID);
  }

  protected getApprovals(): Observable<OrderApproval[]> {
    return this.ocOrderService.ListApprovals('outgoing', this.orderID).pipe(
      map((list) => {
        list.Items = list.Items.filter((x) => x.Approver);
        return _uniqBy(list.Items, (x) => x.Comments);
      })
    );
  }
}
