import { Component, OnInit } from '@angular/core';
import {
  OcMeService,
  ListShipment,
  Shipment,
  ListShipmentItem,
  ListLineItem,
} from '@ordercloud/angular-sdk';
import { ActivatedRoute } from '@angular/router';
import { Observable, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { find as _find } from 'lodash';

@Component({
  selector: 'order-shipments',
  templateUrl: './order-shipments.component.html',
  styleUrls: ['./order-shipments.component.scss'],
})
export class OrderShipmentsComponent implements OnInit {
  selectedShipment: Shipment;
  shipments: ListShipment;
  shipmentItems$: Observable<ListShipmentItem>;
  lineItems: ListLineItem;

  constructor(
    private activatedRoute: ActivatedRoute,
    private ocMeService: OcMeService
  ) {}

  ngOnInit() {
    combineLatest(this.activatedRoute.parent.data, this.activatedRoute.data)
      .pipe(
        map((results) => [
          results[0].orderResolve.lineItems,
          results[1].shipmentsResolve,
        ])
      )
      .subscribe(([lineItems, shipments]) => {
        this.lineItems = lineItems;
        this.shipments = this.setShipmentCount(shipments);
        if (this.shipments.Items.length) {
          this.selectShipment(this.shipments.Items[0]);
        }
      });
  }

  private setShipmentCount(shipments: ListShipment): ListShipment {
    shipments.Items.map((shipment, index) => {
      shipment['count'] = index + 1;
      return shipment;
    });
    return shipments;
  }

  protected selectShipment(shipment: Shipment): void {
    this.selectedShipment = { ...shipment };
    this.shipmentItems$ = this.ocMeService
      .ListShipmentItems(shipment.ID)
      .pipe(map((shipmentItems) => this.setLineItem(shipmentItems)));
  }

  private setLineItem(shipmentItems: ListShipmentItem) {
    shipmentItems.Items.map((item) => {
      const lineItem = _find(
        this.lineItems.Items,
        (li) => li.ID === item.LineItemID
      );
      item['LineItem'] = lineItem;
    });
    return shipmentItems;
  }
}
