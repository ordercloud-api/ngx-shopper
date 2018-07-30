import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderPaymentListComponent } from '@app-buyer/shared/components/payment-list/order-payment-list.component';
import { CreditCardIconComponent } from '@app-buyer/shared/components/credit-card-icon/credit-card-icon.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

describe('Order: PaymentListComponent', () => {
  let component: OrderPaymentListComponent;
  let fixture: ComponentFixture<OrderPaymentListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        FaIconComponent,
        CreditCardIconComponent,
        OrderPaymentListComponent,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderPaymentListComponent);
    component = fixture.componentInstance;
    component.payments = { Items: [] };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
