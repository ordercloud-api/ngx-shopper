import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditCardDisplayComponent } from '@app-buyer/shared/components/credit-card-display/credit-card-display.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { BuyerCreditCard } from '@ordercloud/angular-sdk';
import { CreditCardIconComponent } from '@app-buyer/shared/components/credit-card-icon/credit-card-icon.component';

describe('CreditCardDisplayComponent', () => {
  let component: CreditCardDisplayComponent;
  let fixture: ComponentFixture<CreditCardDisplayComponent>;
  const mockCard = <BuyerCreditCard>{ ID: '1', CardType: 'Visa' };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        FaIconComponent,
        CreditCardIconComponent,
        CreditCardDisplayComponent,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditCardDisplayComponent);
    component = fixture.componentInstance;
    component.card = mockCard;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
