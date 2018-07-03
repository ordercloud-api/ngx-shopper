import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaymentSpendingAccountComponent } from './payment-spending-account.component';

describe('PaymentSpendingAccountComponent', () => {
  let component: PaymentSpendingAccountComponent;
  let fixture: ComponentFixture<PaymentSpendingAccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PaymentSpendingAccountComponent ]
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
});
