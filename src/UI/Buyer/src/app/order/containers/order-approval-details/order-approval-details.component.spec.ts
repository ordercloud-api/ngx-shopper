import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderApprovalDetailsComponent } from './order-approval-details.component';
import { OrderService } from '@ordercloud/angular-sdk';
import { ActivatedRoute, ParamMap, convertToParamMap, Router } from '@angular/router';
import { AppPaymentService } from '@app-buyer/shared/services/app-payment-service/app-payment.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of, BehaviorSubject } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { ModalService } from '@app-buyer/shared';
import { ToastrService } from 'ngx-toastr';

describe('OrderApprovalDetailsComponent', () => {
  let component: OrderApprovalDetailsComponent;
  let fixture: ComponentFixture<OrderApprovalDetailsComponent>;

  const mockOrderID = 'MockGetOrder123';
  const orderService = {
    Get: jasmine.createSpy('Get').and.returnValue(of(null)),
    Approve: jasmine.createSpy('Approve').and.returnValue(of(null)),
    Decline: jasmine.createSpy('Decline').and.returnValue(of(null))
  };
  const appPaymentService = { getPayments: jasmine.createSpy('getPayments').and.returnValue(of(null)) };
  const modalService = {
    open: jasmine.createSpy('open').and.returnValue(null),
    close: jasmine.createSpy('close').and.returnValue(null)
  };
  const toasterService = { success: jasmine.createSpy('success').and.returnValue(null) };
  const router = { navigateByUrl: jasmine.createSpy('navigateByUrl') };

  const paramMap = new BehaviorSubject<ParamMap>(convertToParamMap({ orderID: mockOrderID }));

  const activatedRoute = {
    data: of({ orderResolve: { order: { ID: 'mockOrder' } } }),
    paramMap
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        OrderApprovalDetailsComponent,
      ],
      imports: [
        ReactiveFormsModule
      ],
      providers: [
        { provide: ToastrService, useValue: toasterService },
        { provide: ModalService, useValue: modalService },
        { provide: OrderService, useValue: orderService },
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: Router, useValue: router },
        { provide: AppPaymentService, useValue: appPaymentService }
      ],
      schemas: [NO_ERRORS_SCHEMA], // Ignore template errors: remove if tests are added to test template
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderApprovalDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    component.form.value.comments = '';
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      spyOn(component as any, 'getPayments');
      component.ngOnInit();
    });
    it('should call getPayments', () => {
      expect(component['getPayments']).toHaveBeenCalled();
    });
  });

  describe('getPayments', () => {
    it('should call AppPaymentService', () => {
      component.getPayments().subscribe(() => {
        expect(appPaymentService.getPayments).toHaveBeenCalled();
      });
    });
  });

  describe('open modal', () => {
    beforeEach(() => {
      component.openModal(true);
    });
    it('should call open model', () => {
      expect(modalService.open).toHaveBeenCalledWith(component.modalID);
    });
    it('should set approve value', () => {
      expect(component.approve).toEqual(true);
    });
  });

  describe('submitReview', () => {
    it('Should call Approve if approve is true', () => {
      component.approve = true;
      component.submitReview(mockOrderID);
      expect(orderService.Approve).toHaveBeenCalledWith('outgoing',
      mockOrderID,
      { Comments: component.form.value.comments, AllowResubmit: false });
    });
    it('Should call Decline if approve is false', () => {
      component.approve = false;
      component.submitReview(mockOrderID);
      expect(orderService.Approve).toHaveBeenCalledWith('outgoing',
      mockOrderID,
      { Comments: component.form.value.comments, AllowResubmit: false });
    });
    it('Should do a bunch of things after submitting the review', () => {
      component.submitReview(mockOrderID);
      expect(toasterService.success).toHaveBeenCalled();
      expect(modalService.close).toHaveBeenCalled();
      expect(router.navigateByUrl).toHaveBeenCalled();
    });
  });
});
