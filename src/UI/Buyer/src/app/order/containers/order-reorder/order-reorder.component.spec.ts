import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

import { OrderReorderComponent } from '@app-buyer/order/containers/order-reorder/order-reorder.component.ts';
import {
  ModalService,
  AppReorderService,
  AppLineItemService,
} from '@app-buyer/shared';
import { of } from 'rxjs';

describe('OrderReorderComponent', () => {
  let component: OrderReorderComponent;
  let fixture: ComponentFixture<OrderReorderComponent>;
  let orderID, reorderResponse$;
  let AppReorderServiceTest = {
    order: jasmine.createSpy('order'),
  };
  const modalServiceTest = {
    open: jasmine.createSpy('open').and.returnValue(of({})),
    close: jasmine.createSpy('close'),
  };
  const toastrServiceTest = {
    error: jasmine.createSpy('error').and.returnValue(of()),
  };
  const AppLineItemServiceTest = {
    create: jasmine.createSpy('create').and.returnValue(of({})),
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OrderReorderComponent],
      providers: [
        { provide: ModalService, useValue: modalServiceTest },
        { provide: AppReorderService, useValue: AppReorderServiceTest },
        { provide: AppLineItemService, useValue: AppLineItemServiceTest },
        { provide: ToastrService, useValue: toastrServiceTest },
      ],
      schemas: [NO_ERRORS_SCHEMA], // Ignore template errors: remove if tests are added to test template
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderReorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit with order Input', () => {
    it('should call the OrderReorderService', () => {
      component.orderID = 'orderID';
      component.ngOnInit();
      expect(AppReorderServiceTest.order).toHaveBeenCalled();
    });
  });

  describe('ngOnInit  with no order Input', () => {
    it('should call toastr Error', () => {
      component.orderID = null;
      component.ngOnInit();
      expect(toastrServiceTest.error).toHaveBeenCalled();
    });
  });

  describe('orderReorder', () => {
    it('should call the modalService', () => {
      component.orderReorder();
      expect(modalServiceTest.open).toHaveBeenCalled();
    });
  });

  describe('addToCart', () => {
    beforeEach(() => {
      component.orderID = 'orderID';
    });
    it('should not call the li service create ', () => {
      AppReorderServiceTest.order.and.returnValue(
        of({
          ValidLi: [],
          InvalidLi: [],
        })
      );
      component.ngOnInit();
      component.reorderResponse$ = AppReorderServiceTest.order();
      component.addToCart();
      expect(AppLineItemServiceTest.create).not.toHaveBeenCalled();
    });

    it('should call the li create service the correct amount of times', () => {
      AppReorderServiceTest.order.and.returnValue(
        of({
          ValidLi: [{ Product: {}, Quantity: 2 }, { Product: {}, Quantity: 2 }],
          InvalidLi: [],
        })
      );
      component.ngOnInit();
      reorderResponse$ = AppReorderServiceTest.order();
      component.addToCart();
      expect(AppLineItemServiceTest.create).toHaveBeenCalledTimes(2);
    });
  });
});
