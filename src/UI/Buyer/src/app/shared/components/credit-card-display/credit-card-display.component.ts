import { Component, Input } from '@angular/core';
import { BuyerCreditCard } from '@ordercloud/angular-sdk';

@Component({
  selector: 'shared-credit-card-display',
  templateUrl: './credit-card-display.component.html',
  styleUrls: ['./credit-card-display.component.scss'],
})
export class CreditCardDisplayComponent {
  @Input() card: BuyerCreditCard;
}
