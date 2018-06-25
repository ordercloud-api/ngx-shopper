import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentListComponent } from './payment-list.component';
import { CreditCardIconComponent } from '@app/shared/components/credit-card-icon/credit-card-icon.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

describe('Order: PaymentListComponent', () => {
  let component: PaymentListComponent;
  let fixture: ComponentFixture<PaymentListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        FaIconComponent,
        CreditCardIconComponent,
        PaymentListComponent
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PaymentListComponent);
    component = fixture.componentInstance;
    component.payments = { Items: [] };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
