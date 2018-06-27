import { Component, OnInit, OnDestroy } from '@angular/core';
import { OcLineItemService, BaseResolveService, AppStateService } from '@app/shared';
import { Order, LineItem, OrderService, ListLineItem, MeService, BuyerProduct } from '@ordercloud/angular-sdk';
import { Router } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'checkout-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
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
    private ocLineItemService: OcLineItemService,
    private orderService: OrderService,
    private router: Router,
    private meService: MeService
  ) { }

  ngOnInit() {
    this.currentOrder$ = this.appStateService.orderSubject;
    this.appStateService.lineItemSubject.pipe(takeWhile(() => this.alive))
      .subscribe(lis => {
        this.lineItems = lis;
        if (!this.productsSet) {
          const queue = [];
          lis.Items.forEach(li => queue.push(this.meService.GetProduct(li.ProductID)));
          forkJoin(queue).subscribe(prods => {
            this.products = prods;
            this.productsSet = true;
          });
        }
      });
  }

  getProduct(li: LineItem): BuyerProduct {
    return this.products.find(x => x.ID === li.ProductID);
  }

  cancelOrder() {
    this.orderService.Delete('outgoing', this.appStateService.orderSubject.value.ID)
      .subscribe(() => {
        this.baseResolveService.resetUser();
        this.router.navigate(['/home']);
      });
  }

  deleteLineItem(li: LineItem) {
    return this.ocLineItemService.delete(li.ID)
      .subscribe();
  }

  updateLineItem(li: LineItem) {
    this.ocLineItemService.patch(li.ID, li)
      .subscribe();
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
