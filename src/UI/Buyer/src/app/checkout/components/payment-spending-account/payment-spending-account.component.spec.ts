import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentSpendingAccountComponent } from './payment-spending-account.component';
import { TemplateDropdownComponent } from '@app/shared/components/template-dropdown/template-dropdown.component';
import { of } from 'rxjs';
import { MeService } from '@ordercloud/angular-sdk';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

describe('PaymentSpendingAccountComponent', () => {
  let component: PaymentSpendingAccountComponent;
  let fixture: ComponentFixture<PaymentSpendingAccountComponent>;
  const meService = { ListSpendingAccounts: jasmine.createSpy('ListSpendingAccounts').and.callFake(() => of({ Items: [] })) };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PaymentSpendingAccountComponent,
        TemplateDropdownComponent
      ],
      imports: [FontAwesomeModule],
      providers: [
        { provide: MeService, useValue: meService }
      ]
    })
      .compileComponents();
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
      expect(component.getSavedSpendingAccount(accounts)).toEqual(accounts.Items[0]);
    });
  });

  describe('filterByDate', () => {
    it('should allow accounts with no startDate or end date', () => {
      const accounts = { Items: [{ ID: '1' }, { ID: '2' }] };
      expect(component.filterByDate(accounts)).toEqual(accounts);
    });
    it('should remove accounts with startDate in the future', () => {
      const accounts = {
        Items: [
          { StartDate: '2017-11-01T05:00:00+00:00' },
          { StartDate: '2100-11-01T05:00:00+00:00' }
        ]
      };
      expect(component.filterByDate(accounts)).toEqual({ Items: [{ StartDate: '2017-11-01T05:00:00+00:00' }] });
    });
    it('should remove accounts with endDate in the past', () => {
      const accounts = {
        Items: [
          { EndDate: '2017-11-01T05:00:00+00:00' },
          { EndDate: '2100-11-01T05:00:00+00:00' }
        ]
      };
      expect(component.filterByDate(accounts)).toEqual({ Items: [{ EndDate: '2100-11-01T05:00:00+00:00' }] });
    });
  });

  describe('accountSelected', () => {
    beforeEach(() => {
      component.order = { Total: 10 };
      spyOn(component.paymentCreated, 'emit');
    });
    it('should emit a payment', () => {
      component.accountSelected({ ID: '1'});
      expect(component.paymentCreated.emit).toHaveBeenCalledWith( {
        Type: 'SpendingAccount',
        SpendingAccountID: '1',
        Amount: 10,
        Accepted: true
      });
    });
  });

  describe('validateAndContinue() {', () => {
    beforeEach(() => {
      component.order = { Total: 10 };
      spyOn(component.continue, 'emit');
    });
    it('should throw error if not enough funds', () => {
      component.selectedSpendingAccount = { Balance: 0 };
      fixture.detectChanges();
      expect(() => component.validateAndContinue()).toThrow(new Error('This spending account has insuficient funds'));
    });
    it('should throw error if not allowed', () => {
      component.selectedSpendingAccount = { AllowAsPaymentMethod: false,  Balance: 100  };
      fixture.detectChanges();
      expect(() => component.validateAndContinue()).toThrow(new Error('This spending account is not an allowed payment method.'));
    });
    it('should continue if no errors', () => {
      component.selectedSpendingAccount = { AllowAsPaymentMethod: true,  Balance: 100  };
      fixture.detectChanges();
      component.validateAndContinue();
      expect(component.continue.emit).toHaveBeenCalled();
    });
  });

});
