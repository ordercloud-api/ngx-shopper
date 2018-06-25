import { Component, OnInit } from '@angular/core';
import { Observable, of, forkJoin } from 'rxjs';
import { map, flatMap, tap } from 'rxjs/operators';
import {
  Order,
  ListLineItem,
  ListPromotion,
  OrderService,
  ListPayment,
  PaymentService,
  MeService,
  Address
} from '@ordercloud/angular-sdk';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { OcLineItemService } from '@app/shared';

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
    private paymentService: PaymentService,
    private meService: MeService,
  ) { }

  ngOnInit() {
    this.order$ = this.activatedRoute.parent.data
      .pipe(
        map(({ orderResolve }) => orderResolve.order)
      )
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
        flatMap((params: ParamMap) => {
          const orderID = params.get('orderID');
          return this.paymentService.List('outgoing', orderID)
            .pipe(
              flatMap(paymentList => {
                // put details for each payment type on payment.Details
                let queue = [];
                paymentList.Items.forEach(payment => {
                  if (payment.Type === 'CreditCard') {
                    queue = [...queue, (() => {
                      return this.meService.GetCreditCard(payment.CreditCardID)
                        .pipe(
                          tap(creditCard => {
                            payment['Details'] = creditCard;
                          })
                        )
                    })()];
                  } else if (payment.Type === 'SpendingAccount') {
                    queue = [...queue, (() => {
                      return this.meService.GetSpendingAccount(payment.SpendingAccountID)
                        .pipe(
                          tap(spendingAccount => {
                            payment['Details'] = spendingAccount;
                          })
                        )
                    })()];
                  } else {
                    payment['Details'] = { PONumber: payment.xp.PONumber };
                    queue = [...queue, of(null)];
                  }
                });
                return forkJoin(queue)
                  .pipe(
                    map(() => paymentList)
                  )
              })
            )
        })
      )
  }
}
