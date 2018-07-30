import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { OcOrderService } from '@ordercloud/angular-sdk';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { AppLineItemService } from '@app-buyer/shared';

@Injectable()
export class OrderResolve implements Resolve<any> {
  constructor(
    private ocOrderService: OcOrderService,
    private appLineItemService: AppLineItemService
  ) {}

  resolve(route: ActivatedRouteSnapshot) {
    const orderID = route.paramMap.get('orderID');
    this.ocOrderService.Get('outgoing', orderID);
    return forkJoin([
      this.ocOrderService.Get('outgoing', orderID),
      this.appLineItemService.listAll(orderID),
    ]).pipe(map((results) => ({ order: results[0], lineItems: results[1] })));
  }
}
