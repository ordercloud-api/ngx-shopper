import { Component, OnInit } from '@angular/core';
import {
  OcMeService,
  ListBuyerCreditCard,
  BuyerCreditCard,
  ListSpendingAccount,
} from '@ordercloud/angular-sdk';
import { Observable } from 'rxjs';
import { faPlus, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { AuthorizeNetService, CreateCardDetails } from '@app-buyer/shared';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';

import * as moment from 'moment';

@Component({
  selector: 'profile-payment-list',
  templateUrl: './payment-list.component.html',
  styleUrls: ['./payment-list.component.scss'],
})
export class PaymentListComponent implements OnInit {
  alive = true;
  showCardForm = false;
  faPlus = faPlus;
  faArrowLeft = faArrowLeft;
  faTrashAlt = faTrashAlt;

  cards$: Observable<ListBuyerCreditCard>;
  accounts$: Observable<ListSpendingAccount>;
  currentCard: BuyerCreditCard = null;

  constructor(
    private ocMeService: OcMeService,
    private authorizeNetSerivce: AuthorizeNetService
  ) {}

  ngOnInit() {
    this.getCards();
    this.getAccounts();
  }

  getCards() {
    this.cards$ = this.ocMeService.ListCreditCards();
  }

  getAccounts() {
    const now = moment().format('YYYY-MM-DD');
    const dateFilter = { StartDate: `>${now}|!*`, EndDate: `<${now}|!*` };
    this.accounts$ = this.ocMeService.ListSpendingAccounts({
      filters: dateFilter,
    });
  }

  showEdit(card: BuyerCreditCard) {
    this.showCardForm = true;
    this.currentCard = card;
  }

  showAdd() {
    this.showCardForm = true;
    this.currentCard = null;
  }

  addCard(card: CreateCardDetails) {
    this.authorizeNetSerivce.CreateCreditCard(card).subscribe(
      () => {
        this.showCardForm = false;
        this.getCards();
      },
      (error) => {
        throw error;
      }
    );
  }

  deleteCard(cardId: string) {
    this.authorizeNetSerivce.DeleteCreditCard(cardId).subscribe(
      () => {
        this.getCards();
      },
      (error) => {
        throw error;
      }
    );
  }
}
