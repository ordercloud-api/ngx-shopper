import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { OrderService } from '@ordercloud/angular-sdk';
import { forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { OcLineItemService } from '@app-buyer/shared';

@Injectable()
export class OrderResolve implements Resolve<any> {
    constructor(
        private orderService: OrderService,
        private ocLineItemService: OcLineItemService
    ) { }

    resolve(route: ActivatedRouteSnapshot) {
        const orderID = route.paramMap.get('orderID');
        this.orderService.Get('outgoing', orderID);
        return forkJoin([
            this.orderService.Get('outgoing', orderID),
            this.ocLineItemService.listAll(orderID)
        ]).pipe(
            map(results => ({ order: results[0], lineItems: results[1] }))
        );
    }
}
