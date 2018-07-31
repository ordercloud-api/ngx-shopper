import { Injectable } from '@angular/core';
import { AppLineItemService } from '@app-buyer/shared/services/oc-line-item/oc-line-item.service';
import { orderReorderResponse } from '@app-buyer/shared/services/oc-reorder/oc-reorder.interface';
import { Observable, of, forkJoin } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import { OcMeService, BuyerProduct, LineItem } from '@ordercloud/angular-sdk';
import {
  map as _map,
  forEach as _forEach,
  find as _find,
  differenceBy as _differenceBy,
} from 'lodash';

@Injectable()
export class AppReorderService {
  constructor(
    private ocLineItemService: AppLineItemService,
    private meService: OcMeService
  ) {}

  order(orderID: string): Observable<orderReorderResponse> {
    return this.ocLineItemService.listAll(orderID).pipe(
      flatMap((list) => {
        let lineItems = of(list.Items); // this sets var into an observable
        let productIds = _map(list.Items, 'ProductID');
        let validProducts = this.getValidProducts(productIds);
        return forkJoin([validProducts, lineItems]);
      }),
      flatMap((results) => this.isProductInLiValid(results[0], results[1])),
      flatMap((results) => this.hasInventory(results))
    );
  }

  getValidProducts(
    productIds: string[],
    validProducts?: BuyerProduct[]
  ): Observable<BuyerProduct[]> {
    validProducts = validProducts || [];
    let chunk = productIds.splice(0, 25);
    return this.meService
      .ListProducts({ filters: { ID: chunk.join('|') } })
      .pipe(
        flatMap((productList) => {
          validProducts = validProducts.concat(productList.Items);
          if (productIds.length) {
            return this.getValidProducts(productIds, validProducts);
          } else {
            return of(validProducts);
          }
        })
      );
  }

  isProductInLiValid(
    products: BuyerProduct[],
    lineItems: LineItem[]
  ): Observable<orderReorderResponse> {
    let validProductIDs = _map(products, 'ID');
    let validLi: LineItem[] = [];
    let invalidLi: LineItem[] = [];

    _forEach(lineItems, (li) => {
      if (validProductIDs.indexOf(li.ProductID) > -1) {
        let product = _find(products, { ID: li.ProductID });
        li.Product = product;
        validLi.push(li);
      } else {
        invalidLi.push(li);
      }
    });
    return of({ ValidLi: validLi, InvalidLi: invalidLi });
  }

  hasInventory(
    response: orderReorderResponse
  ): Observable<orderReorderResponse> {
    // compare new validLi with old validLi and push difference into the new invalid[] + old invalid array.
    let newOrderResponse: orderReorderResponse;
    let newValidLi = response.ValidLi.filter(isValidInventory);
    let newInvalidLi = _differenceBy(response.ValidLi, newValidLi, 'ProductID');

    newInvalidLi = newInvalidLi.concat(response.InvalidLi);
    newOrderResponse = { ValidLi: newValidLi, InvalidLi: newInvalidLi };
    console.log('here is the order Response', newOrderResponse);
    return of(newOrderResponse);

    function isValidInventory(li) {
      let inventory = li.Product.Inventory;
      if (hasRestrictedQuantity(li)) {
        if (inventory && inventory.Enabled) {
          if (inventory.OrderCanExceed) {
            return true;
          }
          return inventory.QuantityAvailable >= li.Quantity;
        }
        return true;
      }
      return false;
    }

    function hasRestrictedQuantity(li) {
      let priceSchedule = li.Product.PriceSchedule;
      if (priceSchedule.RestrictedQuantity) {
        //look at price breaks
        if (_find(priceSchedule.PriceBreaks, { Quantity: li.Quantity })) {
          return true;
        }
        return false;
      }
      return true;
    }
  }
}
