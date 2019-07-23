import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { OcOrderService } from '@ordercloud/angular-sdk';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { CartService } from '@app-buyer/shared';

@Injectable({
  providedIn: 'root',
})
export class OrderResolve implements Resolve<any> {
  constructor(
    private ocOrderService: OcOrderService,
    private cartService: CartService
  ) {}

  resolve(route: ActivatedRouteSnapshot) {
    const orderID = route.paramMap.get('orderID');
    return forkJoin([
      this.ocOrderService.Get('outgoing', orderID),
      this.cartService.listAllItems(orderID),
    ]).pipe(map((results) => ({ order: results[0], lineItems: results[1] })));
  }
}
