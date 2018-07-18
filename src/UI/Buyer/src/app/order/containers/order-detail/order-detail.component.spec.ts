import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDetailComponent } from '@app/order/containers/order-detail/order-detail.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { OcLineItemService } from '@app/shared';
import { of, Subject } from 'rxjs';
import { OrderService } from '@ordercloud/angular-sdk';
import { ParamMap, ActivatedRoute, convertToParamMap } from '@angular/router';
import { AppPaymentService } from '@app/shared/services/app-payment-service/app-payment.service';

describe('OrderDetailComponent', () => {
  let component: OrderDetailComponent;
  let fixture: ComponentFixture<OrderDetailComponent>;

  const mockOrderID = 'MockGetOrder123';
  const appLineItemService = {
    getSupplierAddresses: jasmine.createSpy('getSupplierAddresses').and.returnValue(of(null)),
  };
  const orderService = {
    Get: jasmine.createSpy('Get').and.returnValue(of(null)),
    ListPromotions: jasmine.createSpy('ListPromotions').and.returnValue(of(null))
  };
  const appPaymentService = { getPayments: jasmine.createSpy('getPayments').and.returnValue(of(null)) };

  const paramMap = new Subject<ParamMap>();

  const activatedRoute = {
    parent: {
      data: of({ orderResolve: { order: { ID: 'mockOrder' } } })
    },
    paramMap
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        OrderDetailComponent,
      ],
      providers: [
        { provide: OcLineItemService, useValue: appLineItemService },
        { provide: OrderService, useValue: orderService },
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: AppPaymentService, useValue: appPaymentService }
      ],
      schemas: [NO_ERRORS_SCHEMA], // Ignore template errors: remove if tests are added to test template
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      spyOn(component as any, 'getPromotions');
      spyOn(component as any, 'getSupplierAddresses');
      component.ngOnInit();
    });
    it('should call getPromotions', () => {
      expect(component['getPromotions']).toHaveBeenCalled();
    });
    it('should call getSupplierAddresses', () => {
      expect(component['getSupplierAddresses']).toHaveBeenCalled();
    });
  });

  describe('getPromotions', () => {
    it('should call OrderService.ListPromotions with order id param', () => {
      component['getPromotions']().subscribe(() => {
        expect(orderService.ListPromotions).toHaveBeenCalledWith('outgoing', mockOrderID);
      });
      paramMap.next(convertToParamMap({ orderID: mockOrderID }));
    });
  });

  describe('getSupplierAddresses', () => {
    it('should call OcLineItemService.getSupplierAddresses', () => {
      component['getSupplierAddresses']().subscribe(() => {
        expect(appLineItemService.getSupplierAddresses).toHaveBeenCalled();
      });
    });
  });

  describe('getPayments', () => {
    it('should call AppPaymentService', () => {
      component['getSupplierAddresses']().subscribe(() => {
        expect(appPaymentService.getPayments).toHaveBeenCalled();
      });
    });
  });

});
