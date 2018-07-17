import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutConfirmComponent } from './checkout-confirm.component';
import { NO_ERRORS_SCHEMA } from '../../../../../node_modules/@angular/core';
import { BehaviorSubject, of } from '../../../../../node_modules/rxjs';
import { AppStateService, OcLineItemService } from '@app/shared';
import { AppPaymentService } from '@app/shared/services/app-payment-service/app-payment.service';

describe('CheckoutConfirmComponent', () => {
  let component: CheckoutConfirmComponent;
  let fixture: ComponentFixture<CheckoutConfirmComponent>;

  const mockOrder = { ID: '1'};
  const appStateService = { orderSubject: new BehaviorSubject(mockOrder) };
  const appPaymentService = { getPayments: jasmine.createSpy('getPayments').and.returnValue(of(null)) };
  const ocLineItemService = { listAll: jasmine.createSpy('listAll').and.returnValue(of(null)) };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CheckoutConfirmComponent ],
      providers: [
        { provide: AppStateService, useValue: appStateService },
        { provide: AppPaymentService, useValue: appPaymentService },
        { provide: OcLineItemService, useValue: ocLineItemService }
      ],
      schemas: [NO_ERRORS_SCHEMA] // Ignore template errors: remove if tests are added to test template
    })
    .compileComponents();
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
      expect(appPaymentService.getPayments).toHaveBeenCalledWith('outgoing', mockOrder.ID);
      expect(ocLineItemService.listAll).toHaveBeenCalledWith(mockOrder.ID);
    });
  });
});
