import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import { Order, OrderService, ListLineItem, ListPromotion, Address } from '@ordercloud/angular-sdk';
import { OcLineItemService } from '@app/shared';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'checkout-order-confirmation',
  templateUrl: './order-confirmation.component.html',
  styleUrls: ['./order-confirmation.component.scss']
})
export class OrderConfirmationComponent implements OnInit {

  order$: Observable<Order>;
  lineItems$: Observable<ListLineItem>;
  promotions$: Observable<ListPromotion>;
  supplierAddresses$: Observable<Address[]>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private orderService: OrderService,
    private ocLineItemService: OcLineItemService,
  ) { }

  ngOnInit() {
    this.order$ = this.getOrder();
    this.lineItems$ = this.getLineItems();
    this.promotions$ = this.getPromotions();
    this.supplierAddresses$ = this.getSupplierAddresses();
  }

  getOrder(): Observable<Order> {
    return this.activatedRoute.paramMap
      .pipe(
        flatMap((params: ParamMap) => this.orderService.Get('outgoing', params.get('orderID')))
      )
  }

  getLineItems(): Observable<ListLineItem> {
    return this.activatedRoute.paramMap
      .pipe(
        flatMap((params: ParamMap) => this.ocLineItemService.listAll(params.get('orderID')))
      );
  }

  getPromotions() {
    return this.activatedRoute.paramMap
      .pipe(
        flatMap((params: ParamMap) => this.orderService.ListPromotions('outgoing', params.get('orderID')))
      );
  }

  getSupplierAddresses(): Observable<Address[]> {
    return this.ocLineItemService.getSupplierAddresses();
  }
}
