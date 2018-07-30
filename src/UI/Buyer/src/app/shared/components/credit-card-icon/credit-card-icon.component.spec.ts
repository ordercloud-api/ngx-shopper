import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditCardIconComponent } from '@app-buyer/shared/components/credit-card-icon/credit-card-icon.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
  faCcVisa,
  faCcMastercard,
  faCcDiscover,
} from '@fortawesome/free-brands-svg-icons';

describe('CreditCardIconComponent', () => {
  let component: CreditCardIconComponent;
  let fixture: ComponentFixture<CreditCardIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FaIconComponent, CreditCardIconComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditCardIconComponent);
    component = fixture.componentInstance;
    component.card = { CardType: 'Visa' };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      spyOn(component, 'setCardIcon');
      component.ngOnInit();
    });
    it('should call setCardIcon', () => {
      expect(component.setCardIcon).toHaveBeenCalled();
    });
  });

  describe('setCardIcon', () => {
    it('should handle visa', () => {
      component.card.CardType = 'Visa';
      const icon = component.setCardIcon();
      expect(icon).toBe(faCcVisa);
    });
    it('should handle mastercard', () => {
      component.card.CardType = 'MasterCard';
      const icon = component.setCardIcon();
      expect(icon).toBe(faCcMastercard);
    });
    it('should handle discover', () => {
      component.card.CardType = 'Discover';
      const icon = component.setCardIcon();
      expect(icon).toBe(faCcDiscover);
    });
  });
});
