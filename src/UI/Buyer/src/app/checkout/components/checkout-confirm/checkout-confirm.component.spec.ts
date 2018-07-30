import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { CheckoutConfirmComponent } from '@app-buyer/checkout/components/checkout-confirm/checkout-confirm.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';
import { AppStateService, AppLineItemService } from '@app-buyer/shared';
import { AppPaymentService } from '@app-buyer/shared/services/app-payment-service/app-payment.service';
import { FormBuilder } from '@angular/forms';
import { OcOrderService } from '@ordercloud/angular-sdk';
import { applicationConfiguration } from '@app-buyer/config/app.config';

describe('CheckoutConfirmComponent', () => {
  let component: CheckoutConfirmComponent;
  let fixture: ComponentFixture<CheckoutConfirmComponent>;

  const mockConfig = { anonymousShoppingEnabled: false };
  const mockOrder = { ID: '1' };
  const appStateService = { orderSubject: new BehaviorSubject(mockOrder) };
  const appPaymentService = {
    getPayments: jasmine.createSpy('getPayments').and.returnValue(of(null)),
  };
  const ocLineItemService = {
    listAll: jasmine.createSpy('listAll').and.returnValue(of(null)),
  };
  const orderService = {
    Patch: jasmine
      .createSpy('Patch')
      .and.returnValue(of({ ...mockOrder, Comments: 'comment' })),
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CheckoutConfirmComponent],
      providers: [
        FormBuilder,
        { provide: OcOrderService, useValue: orderService },
        { provide: AppStateService, useValue: appStateService },
        { provide: AppPaymentService, useValue: appPaymentService },
        { provide: AppLineItemService, useValue: ocLineItemService },
        { provide: applicationConfiguration, useValue: mockConfig },
      ],
      schemas: [NO_ERRORS_SCHEMA], // Ignore template errors: remove if tests are added to test template
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutConfirmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      component.ngOnInit();
    });
    it('should call the right services', () => {
      expect(component.form).toBeTruthy();
      expect(appPaymentService.getPayments).toHaveBeenCalledWith(
        'outgoing',
        mockOrder.ID
      );
      expect(ocLineItemService.listAll).toHaveBeenCalledWith(mockOrder.ID);
    });
  });

  describe('saveComments', () => {
    it('should call order.Patch', () => {
      spyOn(appStateService.orderSubject, 'next');
      spyOn(component.continue, 'emit');
      component.form.setValue({ comments: 'comment' });
      component.saveComments();
      expect(orderService.Patch).toHaveBeenCalledWith(
        'outgoing',
        mockOrder.ID,
        { ...mockOrder, Comments: 'comment' }
      );
      expect(appStateService.orderSubject.next).toHaveBeenCalledWith({
        ...mockOrder,
        Comments: 'comment',
      });
      expect(component.continue.emit).toHaveBeenCalled();
    });
  });
});
