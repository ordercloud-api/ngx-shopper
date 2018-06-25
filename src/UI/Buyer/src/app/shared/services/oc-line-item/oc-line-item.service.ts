import { Injectable } from '@angular/core';
import { LineItemService, ListLineItem, LineItem, OrderService, SupplierService, SupplierAddressService, Address, ListSupplier, BuyerProduct } from '@ordercloud/angular-sdk';
import { AppStateService } from '../app-state/app-state.service';
import { Observable, of, BehaviorSubject, forkJoin } from 'rxjs';
import { tap, flatMap, map } from 'rxjs/operators';
import { isUndefined as _isUndefined, uniq as _uniq, findIndex as _findIndex } from 'lodash';

@Injectable()
export class OcLineItemService {
  private initializingOrder = false;
  private orderIdSubject: BehaviorSubject<string>;

  constructor(
    private appStateService: AppStateService,
    private lineItemService: LineItemService,
    private supplierService: SupplierService,
    private supplierAddressService: SupplierAddressService,
    private orderService: OrderService,
  ) {
    this.orderIdSubject = new BehaviorSubject<string>('');
  }

  listAll(orderID: string): Observable<ListLineItem> {
    const options = {
      page: 1,
      pageSize: 100
    };
    return this.lineItemService.List('outgoing', orderID, options)
      .pipe(
        flatMap(list => {
          const queue = [];
          if (list.Meta.TotalPages > list.Meta.Page) {
            let page = list.Meta.Page;
            while (page < list.Meta.TotalPages) {
              page++;
              options.page = page;
              queue.push(this.lineItemService.List('outgoing', orderID, options));
            }
            return forkJoin(queue)
              .pipe(
                map((results: ListLineItem[]) => {
                  let allLineItems = [];
                  allLineItems = [...allLineItems, ...list.Items];
                  results.forEach(result => {
                    allLineItems = [...allLineItems, ...result.Items];
                  });
                  const allLineItemList = { Items: allLineItems, Meta: results[0].Meta };
                  return allLineItemList;
                })
              );
          } else {
            return of(list);
          }
        })
      );
  }

  delete(lineItemID: string) {
    // TODO: use oc endpoints for mocking checkout only - replace with integration when ready
    const order = this.appStateService.orderSubject.value;
    return this.lineItemService.Delete('outgoing', order.ID, lineItemID)
      .pipe(
        tap(() => this.onLineItemDelete(lineItemID))
      );
  }

  patch(lineItemID: string, partialLineItem: LineItem): Observable<LineItem> {
    // TODO: use oc endpoints for mocking checkout only - replace with integration when ready
    const order = this.appStateService.orderSubject.value;
    return this.lineItemService.Patch('outgoing', order.ID, lineItemID, partialLineItem)
      .pipe(
        tap(patchedLI => this.onLineItemUpdate(patchedLI))
      );
  }

  create(product: BuyerProduct, quantity: number): Observable<LineItem> {
    // TODO: use oc endpoints for mocking checkout only - replace with integration when ready
    const order = this.appStateService.orderSubject.value;
    const queue = [];
    const newLineItem = {
      ProductID: product.ID,
      Quantity: quantity,
      UnitPrice: null,
    };

    if (!_isUndefined(order.DateCreated)) {

      // order is well defined: we can add line items without issues
      queue.push((() => {
        return this.lineItemService.Create('outgoing', order.ID, newLineItem)
          .pipe(
            tap(createdLI => this.onLineItemUpdate(createdLI))
          );
      })());
    } else {
      // order is not yet defined
      if (!this.initializingOrder) {

        // this is the first line item call - initialize order first
        this.initializingOrder = true;
        queue.push((() => {
          return this.orderService.Create('outgoing', {})
            .pipe(
              flatMap(newOrder => {
                this.initializingOrder = false;
                this.orderIdSubject.next(newOrder.ID);
                this.appStateService.orderSubject.next(newOrder);
                return this.lineItemService.Create('outgoing', newOrder.ID, newLineItem)
                  .pipe(
                    tap(createdLI => this.onLineItemUpdate(createdLI))
                  );
              })
            );
        })());
      } else {
        queue.push((() => {
          // initializing order - wait until its done
          return this.orderIdSubject.subscribe(orderID => {
            if (orderID) {
              return this.lineItemService.Create('outgoing', orderID, newLineItem)
                .pipe(
                  tap(createdLI => this.onLineItemUpdate(createdLI))
                );
            }
          });
        })());
      }
    }
    return forkJoin(queue)
      .pipe(
        map(results => results[0])
      );
  }

  getSuppliers(lineitemList?: ListLineItem): Observable<ListSupplier> {
    let lineItems;
    if (lineitemList) {
      lineItems = lineitemList;
    } else {
      lineItems = this.appStateService.lineItemSubject.value;
    }
    const supplierIds = _uniq(lineItems.Items.map(li => li.xp.product.id.split('-')[0]));
    return this.supplierService.List({ filters: { ID: supplierIds.join('|') } });
  }

  getSupplierAddresses(lineitemList?: ListLineItem): Observable<Address[]> {
    let lineItems;
    if (lineitemList) {
      lineItems = lineitemList;
    } else {
      lineItems = this.appStateService.lineItemSubject.value;
    }
    const supplierIds = _uniq(lineItems.Items.map(li => li.xp.product.id.split('-')[0]));
    let queue = [];
    supplierIds.forEach(supplierID => {
      queue = [...queue, this.getSupplierAddress(supplierID)]
    });
    if (!queue.length) { return of([]) }
    return forkJoin(queue).pipe(
      tap(x => console.log(x))
    )
  }

  getSupplierAddress(supplierID): Observable<Address> {
    return this.supplierAddressService.Get(supplierID, supplierID);
  }

  private onLineItemUpdate(updatedLI: LineItem) {
    // update line item list
    const lineItems = this.appStateService.lineItemSubject.value;
    const index = _findIndex(lineItems.Items, li => li.ID === updatedLI.ID);
    index > -1 ? lineItems.Items[index] = updatedLI : lineItems.Items.push(updatedLI);
    this.appStateService.lineItemSubject.next(lineItems);

    // update order
    const order = this.appStateService.orderSubject.value;
    this.orderService.Get('outgoing', order.ID)
      .subscribe(newOrder => {
        this.appStateService.orderSubject.next(newOrder);
      });
  }

  private onLineItemDelete(lineItemID: string) {
    // update line item list
    const lineItems = this.appStateService.lineItemSubject.value;
    lineItems.Items = lineItems.Items.filter(li => li.ID !== lineItemID);
    this.appStateService.lineItemSubject.next(lineItems);

    // update order
    const order = this.appStateService.orderSubject.value;
    this.orderService.Get('outgoing', order.ID)
      .subscribe(newOrder => {
        this.appStateService.orderSubject.next(newOrder);
      });
  }
}
