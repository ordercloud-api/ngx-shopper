import { Component, Input, Output, EventEmitter } from '@angular/core';
import { BuyerCreditCard } from '@ordercloud/angular-sdk';
import { faTrashAlt, faEdit } from '@fortawesome/free-regular-svg-icons';


@Component({
  selector: 'shared-credit-card-display',
  templateUrl: './credit-card-display.component.html',
  styleUrls: ['./credit-card-display.component.scss']
})
export class CreditCardDisplayComponent {
  faTrashAlt = faTrashAlt;
  faEdit = faEdit;

  @Input() card: BuyerCreditCard;
  @Input() hideDelete?: boolean;
  @Output() delete = new EventEmitter<string>();

  deleteCard() {
    this.delete.emit(this.card.ID);
  }
}
