import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderSummaryComponent } from '@app-buyer/checkout/components/order-summary/order-summary.component';
import { CurrencyPipe } from '@angular/common';

describe('OrderSummaryComponent', () => {
  const currencyPipe = new CurrencyPipe('en-US');
  let component: OrderSummaryComponent;
  let fixture: ComponentFixture<OrderSummaryComponent>;

  const clean = (str) => {
    return str
      .toString()
      .replace(/[\n\r]/g, '')
      .trim();
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OrderSummaryComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    const mockOrder = {
      Test: 10,
      LineItemCount: 1,
      Subtotal: 10,
      TaxCost: 10,
      ShippingCost: 10,
      Total: 30,
      xp: { AddOnsCalculated: true },
    };

    fixture = TestBed.createComponent(OrderSummaryComponent);
    component = fixture.componentInstance;
    component.order = mockOrder;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should disaplay order values properly', () => {
    fixture.detectChanges();

    let el = fixture.nativeElement.querySelector('.sub-total');
    expect(component.order.xp.AddOnsCalculated).toEqual(true);
    expect(el.textContent).toEqual(
      currencyPipe.transform(component.order.Subtotal)
    );

    el = fixture.nativeElement.querySelector('.tax-cost');
    expect(clean(el.textContent)).toEqual(
      currencyPipe.transform(component.order.TaxCost)
    );

    el = fixture.nativeElement.querySelector('.shipping-cost');
    expect(clean(el.textContent)).toEqual(
      currencyPipe.transform(component.order.ShippingCost)
    );

    el = fixture.nativeElement.querySelector('.order-total');
    expect(el.textContent).toEqual(
      currencyPipe.transform(component.order.Total)
    );
  });

  it('should have placeholder text before values are calculated', () => {
    const mockOrder = {
      Test: 10,
      LineItemCount: 1,
      Subtotal: 10,
      TaxCost: 10,
      ShippingCost: 10,
      Total: 30,
      xp: { AddOnsCalculated: false },
    };
    component.order = mockOrder;
    fixture.detectChanges();

    let el = fixture.nativeElement.querySelector('.tax-cost');
    expect(clean(el.textContent)).toEqual('Calculated during checkout');

    el = fixture.nativeElement.querySelector('.shipping-cost');
    expect(clean(el.textContent)).toEqual('Calculated during checkout');
  });

  it('should display free for zero shipping', () => {
    const mockOrder = {
      Test: 10,
      LineItemCount: 1,
      Subtotal: 10,
      TaxCost: 10,
      ShippingCost: 0,
      Total: 30,
      xp: { AddOnsCalculated: true },
    };
    component.order = mockOrder;
    fixture.detectChanges();

    const el = fixture.nativeElement.querySelector('.shipping-cost');
    expect(clean(el.textContent)).toEqual('Free');
  });
});
