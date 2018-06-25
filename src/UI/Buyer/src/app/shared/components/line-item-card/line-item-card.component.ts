import { Component, Output, Input, EventEmitter, OnInit } from '@angular/core';
import { LineItem, BuyerProduct } from '@ordercloud/angular-sdk';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'shared-line-item-card',
  templateUrl: './line-item-card.component.html',
  styleUrls: ['./line-item-card.component.scss']
})
export class LineItemCardComponent implements OnInit {
  closeIcon = faTimes;

  @Input() lineitem: LineItem;
  @Input() productDetails: BuyerProduct;
  @Input() readOnly: boolean;
  @Output() deletedLineItem = new EventEmitter<LineItem>();
  @Output() lineItemUpdated = new EventEmitter<LineItem>();

  constructor() { }

  ngOnInit() { }

  protected deleteLineItem() {
    this.deletedLineItem.emit(this.lineitem);
  }

  protected updateQuantity(qty: number) {
      this.lineitem.Quantity = qty;
      this.lineItemUpdated.emit(this.lineitem);
  }

}
