import { Injectable } from '@angular/core';
import {
  OcLineItemService,
  ListLineItem,
  LineItem,
  OcOrderService,
  BuyerProduct,
  Order,
} from '@ordercloud/angular-sdk';
import { AppStateService } from '@app-buyer/shared/services/app-state/app-state.service';
import { Observable, of, forkJoin } from 'rxjs';
import { tap, flatMap, map } from 'rxjs/operators';
import {
  isUndefined as _isUndefined,
  flatMap as _flatMap,
  get as _get,
} from 'lodash';

@Injectable({
  providedIn: 'root',
})
export class AppLineItemService {
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

  listAll(orderID: string): Observable<ListLineItem> {
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

  delete(lineItemID: string) {
    return this.ocLineItemService
      .Delete('outgoing', this.currentOrder.ID, lineItemID)
      .pipe(tap(() => this.updateAppState()));
  }

  patch(lineItemID: string, partialLineItem: LineItem): Observable<LineItem> {
    return this.ocLineItemService
      .Patch('outgoing', this.currentOrder.ID, lineItemID, partialLineItem)
      .pipe(tap(() => this.updateAppState()));
  }

  create(product: BuyerProduct, quantity: number): Observable<LineItem> {
    const newLineItem = {
      ProductID: product.ID,
      Quantity: quantity,
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
    const existingLI = lineItems.Items.find(
      (li: LineItem) => li.ProductID === newLI.ProductID
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
      this.listAll(this.currentOrder.ID),
    ]).subscribe((res) => {
      this.appStateService.orderSubject.next(res[0]);
      this.appStateService.lineItemSubject.next(res[1]);
    });
  }
}
