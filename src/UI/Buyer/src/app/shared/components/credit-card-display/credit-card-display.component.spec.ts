import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditCardDisplayComponent } from './credit-card-display.component';
import { FontAwesomeModule, FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BuyerCreditCard } from '@ordercloud/angular-sdk';
import { faCcVisa, faCcMastercard, faCcDiscover } from '@fortawesome/free-brands-svg-icons';
import { CreditCardIconComponent } from '@app/shared/components/credit-card-icon/credit-card-icon.component';

describe('CreditCardDisplayComponent', () => {
  let component: CreditCardDisplayComponent;
  let fixture: ComponentFixture<CreditCardDisplayComponent>;
  const mockCard = <BuyerCreditCard>{ ID: '1', CardType: 'Visa' };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        FaIconComponent,
        CreditCardIconComponent,
        CreditCardDisplayComponent
      ],
    })
      .compileComponents();
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

  describe('deleteCard', () => {
    beforeEach(() => {
      spyOn(component.delete, 'emit');
      component.deleteCard();
    });
    it('should emit the cardId', () => {
      expect(component.delete.emit).toHaveBeenCalledWith(mockCard.ID);
    });
  });
});
