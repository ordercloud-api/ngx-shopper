import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutSectionBaseComponent } from '@app-buyer/checkout/components/checkout-section-base/checkout-section-base.component';

describe('CheckoutSectionBaseComponent', () => {
  let component: CheckoutSectionBaseComponent;
  let fixture: ComponentFixture<CheckoutSectionBaseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CheckoutSectionBaseComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutSectionBaseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
