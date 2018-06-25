import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { ListShipment, MeService } from '@ordercloud/angular-sdk';

@Injectable()
export class ShipmentsResolve implements Resolve<ListShipment> {
    constructor(
        private meService: MeService,
    ) { }

    resolve(route: ActivatedRouteSnapshot) {
        const orderID = route.parent.paramMap.get('orderID');
        return this.meService.ListShipments({ orderID: orderID });
    }
}
