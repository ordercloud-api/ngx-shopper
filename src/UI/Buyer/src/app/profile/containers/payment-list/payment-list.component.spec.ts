import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentListComponent } from './payment-list.component';
import { MeService } from '@ordercloud/angular-sdk';
import { AuthorizeNetService } from '@app/shared';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { CreditCardIconComponent } from '@app/shared/components/credit-card-icon/credit-card-icon.component';

describe('PaymentListComponent', () => {
  let component: PaymentListComponent;
  let fixture: ComponentFixture<PaymentListComponent>;

  const meService = { ListCreditCards: jasmine.createSpy('ListCreditCards').and.returnValue(of({})) };
  const authorizeNetService = {
    CreateCreditCard: jasmine.createSpy('CreateCreditCard').and.returnValue({}),
    DeleteCreditCard: jasmine.createSpy('DeleteCreditCard').and.returnValue({})
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CreditCardIconComponent,
        PaymentListComponent,
        CreditCardIconComponent
      ],
      providers: [
        { provide: MeService, useValue: meService },
        { provide: AuthorizeNetService, useValue: authorizeNetService }
      ],
      schemas: [NO_ERRORS_SCHEMA], // Ignore template errors: remove if tests are added to test template
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
