import { Injectable } from '@angular/core';
import { AppLineItemService } from '@app-buyer/shared/services/oc-line-item/oc-line-item.service';
import { orderReorderResponse } from '@app-buyer/shared/services/oc-reorder/oc-reorder.interface';
import { Observable, of, forkJoin } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import { OcMeService, BuyerProduct, LineItem } from '@ordercloud/angular-sdk';
import { forEach as _forEach, differenceBy as _differenceBy } from 'lodash';

@Injectable()
export class AppReorderService {
  constructor(
    private appLineItemService: AppLineItemService,
    private meService: OcMeService
  ) {}

  public order(orderID: string): Observable<orderReorderResponse> {
    return this.appLineItemService.listAll(orderID).pipe(
      flatMap((list) => {
        let lineItems = of(list.Items); // this sets var into an observable
        let productIds = list.Items.map((item) => item.ProductID);
        let validProducts = this.getValidProducts(productIds);
        return forkJoin([validProducts, lineItems]);
      }),
      flatMap((results) => this.isProductInLiValid(results[0], results[1])),
      flatMap((results) => this.hasInventory(results))
    );
  }

  private getValidProducts(
    productIds: string[],
    validProducts: BuyerProduct[] = []
  ): Observable<BuyerProduct[]> {
    validProducts = validProducts;
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

  private isProductInLiValid(
    products: BuyerProduct[],
    lineItems: LineItem[]
  ): Observable<orderReorderResponse> {
    let validProductIDs = products.map((p) => p.ID);
    let validLi: LineItem[] = [];
    let invalidLi: LineItem[] = [];

    _forEach(lineItems, (li) => {
      if (validProductIDs.indexOf(li.ProductID) > -1) {
        let product = products.find((p) => p.ID == li.ProductID);
        li.Product = product;
        validLi.push(li);
      } else {
        invalidLi.push(li);
      }
    });
    return of({ ValidLi: validLi, InvalidLi: invalidLi });
  }

  private hasInventory(
    response: orderReorderResponse
  ): Observable<orderReorderResponse> {
    // compare new validLi with old validLi and push difference into the new invalid[] + old invalid array.
    let newOrderResponse: orderReorderResponse;
    let newValidLi = response.ValidLi.filter(isValidToOrder);
    let newInvalidLi = _differenceBy(response.ValidLi, newValidLi, 'ProductID');

    newInvalidLi = newInvalidLi.concat(response.InvalidLi);
    newOrderResponse = { ValidLi: newValidLi, InvalidLi: newInvalidLi };

    return of(newOrderResponse);

    function isValidToOrder(li) {
      let restrictedOrderQuantity = li.Product.PriceSchedule.RestrictedQuantity;
      let withinPriceBreak;

      if (!restrictedOrderQuantity) {
        return validOrderQuantity(li);
      } else {
        withinPriceBreak = !!li.Product.PriceSchedule.PriceBreaks.find(
          (pb) => pb.Quantity == li.Quantity
        );
        return withinPriceBreak && validOrderQuantity(li);
      }
    }
    function validOrderQuantity(li) {
      let inventory = li.Product.Inventory;
      if (!inventory || !inventory.Enabled || inventory.OrderCanExceed) {
        return true;
      }
      return inventory.QuantityAvailable >= li.Quantity;
    }
  }
}
