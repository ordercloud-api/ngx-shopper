import { Injectable } from '@angular/core';
import {
  OcLineItemService,
  ListLineItem,
  LineItem,
  OcOrderService,
  Order,
  LineItemSpec,
} from '@ordercloud/angular-sdk';
import { AppStateService } from '@app-buyer/shared/services/app-state/app-state.service';
import { Observable, of, forkJoin } from 'rxjs';
import { tap, flatMap, map } from 'rxjs/operators';
import {
  isUndefined as _isUndefined,
  flatMap as _flatMap,
  get as _get,
  isEqual as _isEqual,
} from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private initializingOrder = false;
  private currentOrder: Order;

  constructor(
    private appStateService: AppStateService,
    private ocLineItemService: OcLineItemService,
    private ocOrderService: OcOrderService
  ) {
    this.appStateService.orderSubject.subscribe((order) => {
      this.currentOrder = order;
    });
  }

  listAllItems(orderID: string): Observable<ListLineItem> {
    const options = {
      page: 1,
      pageSize: 100, // The maximum # of records an OC request can return.
    };
    return this.ocLineItemService.List('outgoing', orderID, options).pipe(
      flatMap((list) => {
        if (list.Meta.TotalPages <= 1) {
          return of(list);
        }
        // If more than 100 exist, request all the remaining pages.
        const requests = new Array(list.Meta.TotalPages - 1).map(() => {
          options.page++;
          return this.ocLineItemService.List('outgoing', orderID, options);
        });
        return forkJoin(requests).pipe(
          map((res: ListLineItem[]) => {
            const rest = _flatMap(res, (x) => x.Items);
            return { Items: list.Items.concat(rest), Meta: list.Meta };
          })
        );
      })
    );
  }

  buildSpecList(lineItem: LineItem): string {
    if (lineItem.Specs.length === 0) return '';
    const list = lineItem.Specs.map((spec) => spec.Value).join(', ');
    return `(${list})`;
  }

  removeItem(lineItemID: string) {
    return this.ocLineItemService
      .Delete('outgoing', this.currentOrder.ID, lineItemID)
      .pipe(tap(() => this.updateAppState()));
  }

  updateQuantity(
    lineItemID: string,
    newQuantity: number
  ): Observable<LineItem> {
    return this.ocLineItemService
      .Patch('outgoing', this.currentOrder.ID, lineItemID, {
        Quantity: newQuantity,
      })
      .pipe(tap(() => this.updateAppState()));
  }

  addToCart(
    productID: string,
    quantity: number,
    specs: LineItemSpec[] = []
  ): Observable<LineItem> {
    const newLineItem: LineItem = {
      ProductID: productID,
      Quantity: quantity,
      Specs: specs,
    };
    // order is well defined, line item can be added
    if (!_isUndefined(this.currentOrder.DateCreated)) {
      return this.addLineItem(newLineItem);
    }
    // this is the first line item call - initialize order first
    if (!this.initializingOrder) {
      this.initializingOrder = true;
      return this.ocOrderService.Create('outgoing', {}).pipe(
        flatMap((newOrder) => {
          this.initializingOrder = false;
          this.appStateService.orderSubject.next(newOrder);
          return this.addLineItem(newLineItem);
        })
      );
    }
    // initializing order - wait until its done
    return this.appStateService.orderSubject.pipe(
      flatMap((newOrder) => {
        if (newOrder.ID) {
          return this.addLineItem(newLineItem);
        }
      })
    );
  }

  private addLineItem(newLI: LineItem): Observable<LineItem> {
    const lineItems = this.appStateService.lineItemSubject.value;
    // if line item exists simply update quantity, else create
    const existingLI = lineItems.Items.find((li) =>
      this.LineItemsMatch(li, newLI)
    );

    newLI.Quantity += _get(existingLI, 'Quantity', 0);
    const request = existingLI
      ? this.ocLineItemService.Patch(
          'outgoing',
          this.currentOrder.ID,
          existingLI.ID,
          newLI
        )
      : this.ocLineItemService.Create('outgoing', this.currentOrder.ID, newLI);
    return request.pipe(tap(() => this.updateAppState()));
  }

  private updateAppState() {
    forkJoin([
      this.ocOrderService.Get('outgoing', this.currentOrder.ID),
      this.listAllItems(this.currentOrder.ID),
    ]).subscribe((res) => {
      this.appStateService.orderSubject.next(res[0]);
      this.appStateService.lineItemSubject.next(res[1]);
    });
  }

  // product ID and specs must be the same
  private LineItemsMatch(li1: LineItem, li2: LineItem): boolean {
    return li1.ProductID === li2.ProductID && _isEqual(li1.Specs, li2.Specs);
  }
}
