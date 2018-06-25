import { Component, OnInit, OnDestroy } from '@angular/core';
import { MeService, ListBuyerCreditCard, BuyerCreditCard } from '@ordercloud/angular-sdk';
import { Observable } from 'rxjs';
import { faPlus, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { AuthorizeNetService, CreateCardDetails } from '@app/shared';

@Component({
  selector: 'profile-payment-list',
  templateUrl: './payment-list.component.html',
  styleUrls: ['./payment-list.component.scss']
})
export class PaymentListComponent implements OnInit, OnDestroy {

  alive = true;
  showCardForm = false;
  faPlus = faPlus;
  faArrowLeft = faArrowLeft;
  cards: Observable<ListBuyerCreditCard>;
  currentCard: BuyerCreditCard = null;

  constructor(
    private meService: MeService,
    private authorizeNetSerivce: AuthorizeNetService
  ) { }

  ngOnInit() {
    this.reloadCards();
  }

  reloadCards() {
    this.cards = this.meService.ListCreditCards();
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
        this.reloadCards();
      }, error => {
        throw error;
      });
  }

  deleteCard(cardId: string) {
    this.authorizeNetSerivce.DeleteCreditCard(cardId).subscribe(
      () => {
        this.reloadCards();
      }, error => {
        throw error;
      });
  }

  ngOnDestroy() {
    this.alive = false;
  }

}
