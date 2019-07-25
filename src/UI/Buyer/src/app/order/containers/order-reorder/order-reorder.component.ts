import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { Observable } from 'rxjs';
import { takeWhile, tap } from 'rxjs/operators';

import { forEach as _forEach } from 'lodash';

import {
  ModalService,
  CartService,
  AppReorderService,
} from '@app-buyer/shared';
import { OrderReorderResponse } from '@app-buyer/shared/services/reorder/reorder.interface';

@Component({
  selector: 'order-reorder',
  templateUrl: './order-reorder.component.html',
  styleUrls: ['./order-reorder.component.scss'],
})
export class OrderReorderComponent implements OnInit, OnDestroy {
  @Input() orderID: string;
  reorderResponse$: Observable<OrderReorderResponse>;
  modalID = 'Order-Reorder';
  alive = true;
  message = { string: null, classType: null };

  constructor(
    private appReorderService: AppReorderService,
    private modalService: ModalService,
    private cartService: CartService
  ) {}

  ngOnInit() {
    if (this.orderID) {
      this.reorderResponse$ = this.appReorderService.order(this.orderID).pipe(
        tap((response) => {
          this.updateMessage(response);
        })
      );
    } else {
      throw new Error('Needs Order ID');
    }
  }

  updateMessage(response: OrderReorderResponse): void {
    if (response.InvalidLi.length && !response.ValidLi.length) {
      this.message.string = `None of the line items on this order are available for reorder.`;
      this.message.classType = 'danger';
      return;
    }
    if (response.InvalidLi.length && response.ValidLi.length) {
      this.message.string = `<strong>Warning</strong> The following line items are not available for reorder, clicking add to cart will <strong>only</strong> add valid line items.`;
      this.message.classType = 'warning';
      return;
    }
    this.message.string = `All line items are valid to reorder`;
    this.message.classType = 'success';
  }

  orderReorder() {
    this.modalService.open(this.modalID);
  }

  addToCart() {
    this.reorderResponse$
      .pipe(takeWhile(() => this.alive))
      .subscribe((reorderResponse) => {
        _forEach(reorderResponse.ValidLi, (li) => {
          if (!li) return;
          this.cartService.addToCart(li.Product.ID, li.Quantity).subscribe();
        });
        this.modalService.close(this.modalID);
      });
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
