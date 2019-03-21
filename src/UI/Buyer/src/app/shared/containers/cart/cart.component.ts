import { Component, OnInit, OnDestroy } from '@angular/core';
import {
  Order,
  LineItem,
  OcOrderService,
  ListLineItem,
  OcMeService,
  BuyerProduct,
} from '@ordercloud/angular-sdk';
import { Observable, forkJoin } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
import { AppStateService } from '@app-buyer/shared/services/app-state/app-state.service';
import { BaseResolveService } from '@app-buyer/shared/services/base-resolve/base-resolve.service';
import { AppLineItemService } from '@app-buyer/shared/services/line-item/line-item.service';

@Component({
  selector: 'checkout-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss'],
})
export class CartComponent implements OnInit, OnDestroy {
  currentOrder$: Observable<Order>;
  products: BuyerProduct[];
  lineItems: ListLineItem;
  productsSet = false;
  alive = true;

  constructor(
    private appStateService: AppStateService,
    private baseResolveService: BaseResolveService,
    private appLineItemService: AppLineItemService,
    private ocOrderService: OcOrderService,
    private ocMeService: OcMeService
  ) {}

  ngOnInit() {
    this.currentOrder$ = this.appStateService.orderSubject;
    this.appStateService.lineItemSubject
      .pipe(takeWhile(() => this.alive))
      .subscribe((lis) => {
        this.lineItems = lis;
        if (!this.productsSet) {
          const queue = [];
          lis.Items.forEach((li) =>
            queue.push(this.ocMeService.GetProduct(li.ProductID))
          );
          forkJoin(queue).subscribe((prods) => {
            this.products = prods;
            this.productsSet = true;
          });
        }
      });
  }

  getProduct(li: LineItem): BuyerProduct {
    return this.products.find((x) => x.ID === li.ProductID);
  }

  cancelOrder() {
    this.ocOrderService
      .Delete('outgoing', this.appStateService.orderSubject.value.ID)
      .subscribe(() => {
        this.baseResolveService.resetUser();
      });
  }

  deleteLineItem(li: LineItem) {
    return this.appLineItemService.delete(li.ID).subscribe();
  }

  updateLineItem(li: LineItem) {
    this.appLineItemService.patch(li.ID, li).subscribe();
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
