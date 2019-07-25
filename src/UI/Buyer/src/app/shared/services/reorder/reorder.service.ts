import { Injectable } from '@angular/core';
import { OrderReorderResponse } from '@app-buyer/shared/services/reorder/reorder.interface';
import { Observable, of, forkJoin } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import { OcMeService, BuyerProduct, LineItem } from '@ordercloud/angular-sdk';
import { forEach as _forEach, differenceBy as _differenceBy } from 'lodash';
import { CartService } from '@app-buyer/shared/services/cart/cart.service';

@Injectable({
  providedIn: 'root',
})
export class AppReorderService {
  constructor(
    private cartService: CartService,
    private meService: OcMeService
  ) {}

  public order(orderID: string): Observable<OrderReorderResponse> {
    if (!orderID) throw new Error('Needs Order ID');
    return this.cartService.listAllItems(orderID).pipe(
      flatMap((list) => {
        const lineItems = of(list.Items); // this sets var into an observable
        const productIds = list.Items.map((item) => item.ProductID);
        const validProducts = this.getValidProducts(productIds);
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
    const chunk = productIds.splice(0, 25);
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
  ): Observable<OrderReorderResponse> {
    const validProductIDs = products.map((p) => p.ID);
    const validLi: LineItem[] = [];
    const invalidLi: LineItem[] = [];

    _forEach(lineItems, (li) => {
      if (validProductIDs.indexOf(li.ProductID) > -1) {
        const product = products.find((p) => p.ID === li.ProductID);
        li.Product = product;
        validLi.push(li);
      } else {
        invalidLi.push(li);
      }
    });
    return of({ ValidLi: validLi, InvalidLi: invalidLi });
  }

  private hasInventory(
    response: OrderReorderResponse
  ): Observable<OrderReorderResponse> {
    // compare new validLi with old validLi and push difference into the new invalid[] + old invalid array.
    let newOrderResponse: OrderReorderResponse;
    const newValidLi = response.ValidLi.filter(isValidToOrder);
    let newInvalidLi = _differenceBy(response.ValidLi, newValidLi, 'ProductID');

    newInvalidLi = newInvalidLi.concat(response.InvalidLi);
    newOrderResponse = { ValidLi: newValidLi, InvalidLi: newInvalidLi };

    return of(newOrderResponse);

    function isValidToOrder(li) {
      const restrictedOrderQuantity =
        li.Product.PriceSchedule.RestrictedQuantity;
      let withinPriceBreak;

      if (!restrictedOrderQuantity) {
        return validOrderQuantity(li);
      } else {
        withinPriceBreak = li.Product.PriceSchedule.PriceBreaks.some(
          (pb) => pb.Quantity === li.Quantity
        );
        return withinPriceBreak && validOrderQuantity(li);
      }
    }
    function validOrderQuantity(li) {
      const inventory = li.Product.Inventory;
      if (!inventory || !inventory.Enabled || inventory.OrderCanExceed) {
        return true;
      }
      return inventory.QuantityAvailable >= li.Quantity;
    }
  }
}
