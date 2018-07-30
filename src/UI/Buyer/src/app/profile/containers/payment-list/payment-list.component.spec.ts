import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentListComponent } from '@app-buyer/profile/containers/payment-list/payment-list.component';
import { OcMeService } from '@ordercloud/angular-sdk';
import { AuthorizeNetService, CreateCardDetails } from '@app-buyer/shared';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { CreditCardIconComponent } from '@app-buyer/shared/components/credit-card-icon/credit-card-icon.component';

describe('PaymentListComponent', () => {
  let component: PaymentListComponent;
  let fixture: ComponentFixture<PaymentListComponent>;

  const meService = {
    ListCreditCards: jasmine
      .createSpy('ListCreditCards')
      .and.returnValue(of({})),
    ListSpendingAccounts: jasmine
      .createSpy('ListSpendingAccounts')
      .and.returnValue(of({})),
  };
  const authorizeNetService = {
    CreateCreditCard: jasmine
      .createSpy('CreateCreditCard')
      .and.returnValue(of({})),
    DeleteCreditCard: jasmine
      .createSpy('DeleteCreditCard')
      .and.returnValue(of({})),
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CreditCardIconComponent,
        PaymentListComponent,
        CreditCardIconComponent,
      ],
      providers: [
        { provide: OcMeService, useValue: meService },
        { provide: AuthorizeNetService, useValue: authorizeNetService },
      ],
      schemas: [NO_ERRORS_SCHEMA], // Ignore template errors: remove if tests are added to test template
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call the correct services', () => {
      component.ngOnInit();
      expect(meService.ListCreditCards).toHaveBeenCalled();
      expect(meService.ListSpendingAccounts).toHaveBeenCalled();
    });
  });

  describe('deleteCard', () => {
    it('should call the correct services', () => {
      component.deleteCard('ID');
      expect(authorizeNetService.DeleteCreditCard).toHaveBeenCalled();
    });
  });

  describe('addCard', () => {
    it('should call the correct services', () => {
      component.addCard(<CreateCardDetails>{});
      expect(authorizeNetService.CreateCreditCard).toHaveBeenCalled();
    });
  });
});
