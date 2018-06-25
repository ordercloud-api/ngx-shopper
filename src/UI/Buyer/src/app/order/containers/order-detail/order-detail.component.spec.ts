import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderDetailComponent } from './order-detail.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { OcLineItemService } from '@app/shared';
import { of, Subject } from 'rxjs';
import { OrderService, PaymentService, MeService } from '@ordercloud/angular-sdk';
import { ParamMap, ActivatedRoute, convertToParamMap } from '@angular/router';

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
  const meService = {
    GetCreditCard: jasmine.createSpy('GetCreditCard').and.callFake(cc => of(cc)),
    GetSpendingAccount: jasmine.createSpy('GetSpendingAccount').and.callFake(sa => of(sa))
  };
  const paymentList = {
    Items: [
      { Type: 'CreditCard', CreditCardID: 'CreditCardOne' },
      { Type: 'CreditCard', CreditCardID: 'CreditCardTwo' },
      { Type: 'SpendingAccount', SpendingAccountID: 'SpendingAccountOne' },
      { Type: 'SpendingAccount', SpendingAccountID: 'SpendingAccountTwo' },
      { Type: 'PurchaseOrder', ID: 'PurchaseOrderOne', xp: { PONumber: '123456' } },
    ]
  };
  const paymentService = {
    List: jasmine.createSpy('List').and.returnValue(of(paymentList))
  };
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
        { provide: PaymentService, useValue: paymentService },
        { provide: OcLineItemService, useValue: appLineItemService },
        { provide: OrderService, useValue: orderService },
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: MeService, useValue: meService },
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
    beforeEach(() => {
      component.getPayments().subscribe();
    });
    it('should call paymentService.list', () => {
      expect(paymentService.List).toHaveBeenCalled();
    })
    it('should call meService.GetCredit card for each cc payment', () => {
      expect(meService.GetCreditCard).toHaveBeenCalledWith('CreditCardOne');
      expect(meService.GetCreditCard).toHaveBeenCalledWith('CreditCardTwo');
      expect(meService.GetCreditCard.calls.count()).toBe(2);
    });
    it('should call meService.GetSpendingAccount for each spending account payment', () => {
      expect(meService.GetSpendingAccount).toHaveBeenCalledWith('SpendingAccountOne');
      expect(meService.GetSpendingAccount).toHaveBeenCalledWith('SpendingAccountTwo');
      expect(meService.GetSpendingAccount.calls.count()).toBe(2);
    });
  });
});
