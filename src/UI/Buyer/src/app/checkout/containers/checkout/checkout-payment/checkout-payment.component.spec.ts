import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutPaymentComponent } from './checkout-payment.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ReactiveFormsModule } from '@angular/forms';
import { CreditCardFormComponent } from '@app/shared/components/credit-card-form/credit-card-form.component';
import { CreditCardDisplayComponent } from '@app/shared/components/credit-card-display/credit-card-display.component';
import { MeService, PaymentService } from '@ordercloud/angular-sdk';
import { AppStateService, AuthorizeNetService } from '@app/shared';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('CheckoutPaymentComponent', () => {
  let component: CheckoutPaymentComponent;
  let fixture: ComponentFixture<CheckoutPaymentComponent>;
  const mockCreditCards = { Items: [{ ID: '1'}] };
  const mockPayment = { Items: [{ CreditCardID: '1'}] };
  const mockOrder = { ID: '1', xp: { cardDetails: { CardholderName: 'test' } } };
  const meService = { ListCreditCards: jasmine.createSpy('ListCreditCards').and.returnValue(of(mockCreditCards)) };
  const appStateService = { orderSubject: { value: mockOrder } };
  const paymentService = { List: jasmine.createSpy('List').and.returnValue(of(mockPayment)) };
  const authorizeNetService = {
    AuthoizeCard: jasmine.createSpy('SendVerificationCode').and.returnValue(of({})),
    AuthoizeAnonymousCard: jasmine.createSpy('AuthorizeAnonymousCard').and.returnValue(of({}))
 };


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CheckoutPaymentComponent,
        CreditCardDisplayComponent,
        CreditCardFormComponent
       ],
      imports: [
        FontAwesomeModule,
        ReactiveFormsModule
      ],
      providers: [
        { provide: MeService, useValue: meService },
        { provide: AppStateService, useValue: appStateService },
        { provide: PaymentService, useValue: paymentService },
        { provide: AuthorizeNetService, useValue: authorizeNetService }
      ],
      schemas: [NO_ERRORS_SCHEMA] // Ignore template errors: remove if tests are added to test template
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutPaymentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    component.isAnon = true;
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should handle anonymous user with existing payment', () => {
      component.isAnon = true;
      component.ngOnInit();
      fixture.detectChanges();

      expect(component.existingCards).toEqual(null);
      expect(component.existingPayment).toEqual(mockPayment.Items[0]);
      expect(component.selectedCard).toEqual(mockOrder.xp.cardDetails);
      expect(component.showAdd).toEqual(false);
    });
  });
  describe('ngOnInit', () => {
    it('should handle known users with existing payment', () => {
      component.isAnon = false;
      component.ngOnInit();
      fixture.detectChanges();

      expect(component.existingCards).toEqual(mockCreditCards);
      expect(component.existingPayment).toEqual(mockPayment.Items[0]);
      expect(component.selectedCard).toEqual(mockCreditCards.Items[0]);
      expect(component.showAdd).toEqual(false);
    });
  });
});
