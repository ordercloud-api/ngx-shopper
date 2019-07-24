import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { OrderReorderComponent } from '@app-buyer/order/containers/order-reorder/order-reorder.component';
import {
  ModalService,
  AppReorderService,
  CartService,
} from '@app-buyer/shared';
import { of } from 'rxjs';

describe('OrderReorderComponent', () => {
  let component: OrderReorderComponent;
  let fixture: ComponentFixture<OrderReorderComponent>;
  let reorderResponse$;
  let AppReorderServiceTest = null;

  const modalServiceTest = {
    open: jasmine.createSpy('open').and.returnValue(of({})),
    close: jasmine.createSpy('close'),
  };

  const AppLineItemServiceTest = {
    addToCart: jasmine.createSpy('addToCart').and.returnValue(of({})),
  };

  beforeEach(async(() => {
    AppReorderServiceTest = {
      order: jasmine.createSpy('order').and.returnValue(
        of({
          ValidLi: [{ Product: {}, Quantity: 2 }, { Product: {}, Quantity: 2 }],
          InvalidLi: [],
        })
      ),
    };
    TestBed.configureTestingModule({
      declarations: [OrderReorderComponent],
      providers: [
        { provide: ModalService, useValue: modalServiceTest },
        { provide: AppReorderService, useValue: AppReorderServiceTest },
        { provide: CartService, useValue: AppLineItemServiceTest },
      ],
      schemas: [NO_ERRORS_SCHEMA], // Ignore template errors: remove if tests are added to test template
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderReorderComponent);
    component = fixture.componentInstance;
    component.orderID = 'orderID';
    fixture.detectChanges();
  });

  afterEach(() => {
    AppReorderServiceTest = null;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit with order Input', () => {
    it('should call the OrderReorderService', () => {
      component.ngOnInit();
      expect(AppReorderServiceTest.order).toHaveBeenCalled();
    });
  });

  describe('ngOnInit  with no order Input', () => {
    it('should call toastr Error', () => {
      component.orderID = null;
      fixture.detectChanges();
      expect(() => component.ngOnInit()).toThrow(new Error('Needs Order ID'));
    });
  });

  describe('orderReorder', () => {
    it('should call the modalService', () => {
      component.orderReorder();
      expect(modalServiceTest.open).toHaveBeenCalled();
    });
  });

  describe('addToCart', () => {
    it('should not call the li service create ', () => {
      AppReorderServiceTest.order.and.returnValue(
        of({
          ValidLi: [],
          InvalidLi: [],
        })
      );
      fixture.detectChanges();
      component.reorderResponse$ = AppReorderServiceTest.order();
      component.ngOnInit();
      component.addToCart();
      expect(AppLineItemServiceTest.addToCart).not.toHaveBeenCalled();
    });

    it('should call the li create service the correct amount of times', () => {
      AppReorderServiceTest.order.and.returnValue(
        of({
          ValidLi: [{ Product: {}, Quantity: 2 }, { Product: {}, Quantity: 2 }],
          InvalidLi: [],
        })
      );

      reorderResponse$ = AppReorderServiceTest.order();
      component.ngOnInit();
      component.addToCart();
      expect(AppLineItemServiceTest.addToCart).toHaveBeenCalledTimes(2);
    });
  });
});
