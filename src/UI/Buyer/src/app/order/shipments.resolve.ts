import { Injectable } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { ListShipment, OcMeService } from '@ordercloud/angular-sdk';

@Injectable({
  providedIn: 'root',
})
export class ShipmentsResolve implements Resolve<ListShipment> {
  constructor(private ocMeService: OcMeService) {}

  resolve(route: ActivatedRouteSnapshot) {
    const orderID = route.parent.paramMap.get('orderID');
    return this.ocMeService.ListShipments({ orderID: orderID });
  }
}
