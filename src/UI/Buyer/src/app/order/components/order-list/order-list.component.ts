import { Component, Input, EventEmitter, Output } from '@angular/core';
import { ListOrder } from '@ordercloud/angular-sdk';
import { OrderListColumn } from '@app/order/models/order-list-column';
import { faCaretDown, faCaretUp } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'order-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent {
  @Input() orders: ListOrder;
  @Input() columns: OrderListColumn[];
  @Input() sortBy: string;
  @Input() favoriteOrders: string[];
  faCaretDown = faCaretDown;
  faCaretUp = faCaretUp;
  @Output() updatedSort = new EventEmitter<string>();
  @Output() changedPage = new EventEmitter<number>();
  @Output() favoriteChanged = new EventEmitter<{ isFav: boolean, orderID: string }>();

  protected updateSort(selectedSortBy) {
    let sortBy;
    switch (this.sortBy) {
      case selectedSortBy:
        sortBy = `!${selectedSortBy}`;
        break;
      case `!${selectedSortBy}`:
        // setting to undefined so sdk ignores parameter
        sortBy = undefined;
        break;
      default:
        sortBy = selectedSortBy;
    }
    this.updatedSort.emit(sortBy);
  }

  protected changePage(page: number): void {
    this.changedPage.emit(page);
  }

  protected isFavorite(orderID) {
    return this.favoriteOrders.indexOf(orderID) > -1;
  }
}
