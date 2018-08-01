import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentSpendingAccountComponent } from '@app-buyer/checkout/components/payment-spending-account/payment-spending-account.component';
import { of } from 'rxjs';
import { OcMeService } from '@ordercloud/angular-sdk';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ModalService } from '@app-buyer/shared';

describe('PaymentSpendingAccountComponent', () => {
  let component: PaymentSpendingAccountComponent;
  let fixture: ComponentFixture<PaymentSpendingAccountComponent>;
  const meService = {
    ListSpendingAccounts: jasmine
      .createSpy('ListSpendingAccounts')
      .and.callFake(() => of({ Items: [] })),
  };
  const modalService = {
    open: jasmine.createSpy('open'),
    close: jasmine.createSpy('close'),
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PaymentSpendingAccountComponent],
      imports: [FontAwesomeModule],
      providers: [
        { provide: ModalService, useValue: modalService },
        { provide: OcMeService, useValue: meService },
      ],
      schemas: [NO_ERRORS_SCHEMA], // Ignore template errors: remove if tests are added to test template
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentSpendingAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getSavedSpendingAccount', () => {
    const accounts = { Items: [{ ID: '1' }, { ID: '2' }] };
    it('should return null if no existing payment', () => {
      component.payment = null;
      expect(component.getSavedSpendingAccount(accounts)).toEqual(null);
    });
    it('should return null if existing payment is not a spending account', () => {
      component.payment = { ID: '1' };
      expect(component.getSavedSpendingAccount(accounts)).toEqual(null);
    });
    it('should return null if saved spending account no longer exists', () => {
      component.payment = { ID: '1', SpendingAccountID: '3' };
      expect(component.getSavedSpendingAccount(accounts)).toEqual(null);
    });
    it('should return the correct spending account if saved properly', () => {
      component.payment = { ID: '1', SpendingAccountID: '1' };
      expect(component.getSavedSpendingAccount(accounts)).toEqual(
        accounts.Items[0]
      );
    });
  });

  describe('accountSelected', () => {
    beforeEach(() => {
      spyOn(component.paymentCreated, 'emit');
    });
    it('should emit a payment', () => {
      component.accountSelected({ ID: '1' });
      expect(component.paymentCreated.emit).toHaveBeenCalledWith({
        Type: 'SpendingAccount',
        SpendingAccountID: '1',
        Accepted: true,
      });
    });
  });

  describe('validateAndContinue() {', () => {
    beforeEach(() => {
      component.order = { Total: 10 };
      spyOn(component.continue, 'emit');
    });
    it('should throw error if no spending account was selected', () => {
      component.selectedSpendingAccount = null;
      fixture.detectChanges();
      expect(() => component.validateAndContinue()).toThrow(
        new Error('Please select a spending account')
      );
    });
    it('should throw error if not enough funds', () => {
      component.selectedSpendingAccount = { Balance: 0 };
      fixture.detectChanges();
      expect(() => component.validateAndContinue()).toThrow(
        new Error('This spending account has insuficient funds')
      );
    });
    it('should throw error if not allowed', () => {
      component.selectedSpendingAccount = {
        AllowAsPaymentMethod: false,
        Balance: 100,
      };
      fixture.detectChanges();
      expect(() => component.validateAndContinue()).toThrow(
        new Error('This spending account is not an allowed payment method.')
      );
    });
    it('should continue if no errors', () => {
      component.selectedSpendingAccount = {
        AllowAsPaymentMethod: true,
        Balance: 100,
      };
      fixture.detectChanges();
      component.validateAndContinue();
      expect(component.continue.emit).toHaveBeenCalled();
    });
  });

  describe('updateRequestOptions', () => {
    beforeEach(() => {
      component.requestOptions = { page: undefined, search: undefined };
    });
    it('should pass page parameter', () => {
      component['updateRequestOptions']({ page: 3 });
      expect(component.requestOptions).toEqual({ search: undefined, page: 3 });
    });
    it('should pass search parameter', () => {
      component['updateRequestOptions']({ search: 'searchTerm' });
      expect(component.requestOptions).toEqual({
        search: 'searchTerm',
        page: undefined,
      });
    });
  });
});
