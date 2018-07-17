import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderShipmentsComponent } from '@app/order/containers/order-shipments/order-shipments.component';
import { of, Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { MeService } from '@ordercloud/angular-sdk';
import { ShipperTrackingPipe, ShipperTrackingSupportedPipe } from '@app/shared/pipes/shipperTracking/shipperTracking.pipe';

describe('OrderShipmentsComponent', () => {
  let component: OrderShipmentsComponent;
  let fixture: ComponentFixture<OrderShipmentsComponent>;

  const dataSubject = new Subject<any>();
  const parentDataSubject = new Subject<any>();
  const shipmentsResolve = { Items: [{ ID: 'ShipmentOne' }] };
  const lineItemListResolve = {
    Items: [
      { ID: 'LineItemOne', xp: { product: {} } },
      { ID: 'LineItemTwo', xp: { product: {} } }
    ]
  };
  const shipmentItems = {
    Items: [
      { LineItemID: 'LineItemTwo' }, { LineItemID: 'LineItemOne' },
    ]
  };
  const activatedRoute = {
    data: of({ shipmentsResolve }),
    parent: {
      data: of({
        orderResolve: {
          lineItems: lineItemListResolve
        }
      })
    }
  };
  const meService = { ListShipmentItems: jasmine.createSpy('ListShipmentItems').and.returnValue(of(shipmentItems)) };
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ShipperTrackingPipe,
        ShipperTrackingSupportedPipe,
        OrderShipmentsComponent
      ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: MeService, useValue: meService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderShipmentsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      spyOn(component as any, 'setShipmentCount').and.callThrough();
      spyOn(component as any, 'selectShipment').and.callThrough();
      component.ngOnInit();
    });
    it('should call setShipmentCount', () => {
      expect(component['setShipmentCount']).toHaveBeenCalledWith(shipmentsResolve);
    });
    it('should call selectShipment', () => {
      expect(component['selectShipment']).toHaveBeenCalledWith(shipmentsResolve.Items[0]);
    });
    it('should set line items', () => {
      expect(component.lineItems).toEqual(lineItemListResolve);
    });
  });

  describe('setShipmentCount', () => {
    it('should set a count property on each shipment', () => {
      const shipmentsAfterCount = component['setShipmentCount'](shipmentsResolve);
      expect(shipmentsAfterCount.Items[0]['count']).toBe(1);
    });
  });

  describe('selectShipment', () => {
    beforeEach(() => {
      spyOn(component as any, 'setLineItem').and.callThrough();
      component['selectShipment'](shipmentsResolve.Items[0]);
    });
    it('should set selected shipment to shipment passed in', () => {
      expect(component.selectedShipment).toEqual(shipmentsResolve.Items[0]);
    });
    it('should list shipment items', () => {
      expect(meService.ListShipmentItems).toHaveBeenCalledWith(shipmentsResolve.Items[0].ID);
    });
    it('should call set line items', () => {
      component.shipmentItems$.subscribe();
      expect(component['setLineItem']).toHaveBeenCalled();
    });
  });

  describe('setLineItem', () => {
    it('should set LineItem property on shipment items', () => {
      const modifiedShipmentItems = component['setLineItem'](shipmentItems);
      expect(modifiedShipmentItems.Items[0]['LineItem']).toEqual({ ID: 'LineItemTwo', xp: { product: {} } });
      expect(modifiedShipmentItems.Items[1]['LineItem']).toEqual({ ID: 'LineItemOne', xp: { product: {} } });
    });
  });
});
