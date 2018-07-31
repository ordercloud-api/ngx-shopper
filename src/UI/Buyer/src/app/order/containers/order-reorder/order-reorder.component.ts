import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

import { forEach as _forEach } from 'lodash';

import {
  ModalService,
  AppLineItemService,
  AppReorderService,
} from '@app-buyer/shared';
import { orderReorderResponse } from '@app-buyer/shared/services/oc-reorder/oc-reorder.interface';

@Component({
  selector: 'order-reorder',
  templateUrl: './order-reorder.component.html',
  styleUrls: ['./order-reorder.component.scss'],
})
export class OrderReorderComponent implements OnInit {
  @Input() orderID: string;
  reorderResponse$: Observable<orderReorderResponse>;
  modalID = 'Order-Reorder';
  alive = true;

  constructor(
    private appReorderService: AppReorderService,
    private modalService: ModalService,
    private appLineItemService: AppLineItemService,
    private toastrService: ToastrService
  ) {}

  ngOnInit() {
    if (this.orderID) {
      this.reorderResponse$ = this.appReorderService.order(this.orderID);
    } else {
      console.log('order ID is needed to use the reorder-order component');
      this.toastrService.error('Needs Order ID');
    }
  }

  orderReorder() {
    this.modalService.open(this.modalID);
  }

  addToCart() {
    this.reorderResponse$.subscribe((reorderResponse) => {
      _forEach(reorderResponse.ValidLi, (li) => {
        if (!li) return;
        this.appLineItemService.create(li.Product, li.Quantity).subscribe();
      });
      this.modalService.close(this.modalID);
    });
  }
}
