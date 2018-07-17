import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderConfirmationComponent } from '@app/checkout/containers/order-confirmation/order-confirmation.component';
import { ParamMap, ActivatedRoute, convertToParamMap } from '@angular/router';
import { OcLineItemService } from '@app/shared';
import { OrderService } from '@ordercloud/angular-sdk';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, Subject } from 'rxjs';
import { AppPaymentService } from '@app/shared/services/app-payment-service/app-payment.service';

describe('OrderConfirmationComponent', () => {
  let component: OrderConfirmationComponent;
  let fixture: ComponentFixture<OrderConfirmationComponent>;

  const mockOrderID = 'MockGetOrder123';
  const appLineItemService = {
    listAll: jasmine.createSpy('listAll').and.returnValue(of(null)),
  };
  const orderService = {
    Get: jasmine.createSpy('Get').and.returnValue(of(null)),
    ListPromotions: jasmine.createSpy('List').and.returnValue(of(null))
  };
  const appPaymentService = { getPayments: jasmine.createSpy('getPayments').and.returnValue(of(null)) };
  const paramMap = new Subject<ParamMap>();

  const activatedRoute = {
    paramMap
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        OrderConfirmationComponent,
      ],
      providers: [
        { provide: OcLineItemService, useValue: appLineItemService },
        { provide: OrderService, useValue: orderService },
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: AppPaymentService, appPaymentService }
      ],
      schemas: [NO_ERRORS_SCHEMA], // Ignore template errors: remove if tests are added to test template
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderConfirmationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      spyOn(component as any, 'getOrder');
      spyOn(component as any, 'getLineItems');
      spyOn(component as any, 'getPromotions');
      component.ngOnInit();
    });
    it('should call getOrder', () => {
      expect(component.getOrder).toHaveBeenCalled();
    });
    it('should call getLineItems', () => {
      expect(component.getLineItems).toHaveBeenCalled();
    });
    it('should call getPromotions', () => {
      expect(component.getPromotions).toHaveBeenCalled();
    });
  });

  describe('getOrder', () => {
    it('should call OrderService.Get with order id param', () => {
      component.getOrder().subscribe(() => {
        expect(orderService.Get).toHaveBeenCalledWith('outgoing', mockOrderID);
      });
      paramMap.next(convertToParamMap({ orderID: mockOrderID }));
    });
  });

  describe('getLineItems', () => {
    it('should call OcLineItems.ListAll with order id param', () => {
      component.getLineItems().subscribe(() => {
        expect(appLineItemService.listAll).toHaveBeenCalledWith(mockOrderID);
      });
      paramMap.next(convertToParamMap({ orderID: mockOrderID }));
    });
  });

  describe('getPromotions', () => {
    it('should call OrderService.ListPromotions with order id param', () => {
      component.getPromotions().subscribe(() => {
        expect(orderService.ListPromotions).toHaveBeenCalledWith('outgoing', mockOrderID);
      });
      paramMap.next(convertToParamMap({ orderID: mockOrderID }));
    });
  });
});
