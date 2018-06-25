import { Component, OnInit, Input } from '@angular/core';
import { CheckoutSectionBaseComponent } from '@app/checkout/components/checkout-section-base/checkout-section-base.component';
import { MeService, BuyerCreditCard, ListBuyerCreditCard, PaymentService, Payment } from '@ordercloud/angular-sdk';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AppStateService, AuthorizeNetService, CreateCardDetails } from '@app/shared';
import { Observable, forkJoin } from 'rxjs';
import { tap, flatMap } from 'rxjs/operators';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'checkout-payment',
  templateUrl: './checkout-payment.component.html',
  styleUrls: ['./checkout-payment.component.scss']
})
export class CheckoutPaymentComponent extends CheckoutSectionBaseComponent implements OnInit {

  constructor(
    private meService: MeService,
    private formBuilder: FormBuilder,
    private appStateService: AppStateService,
    private paymentService: PaymentService,
    private authorizeNetService: AuthorizeNetService
  ) {
    super();
  }

  readonly order = this.appStateService.orderSubject.value;

  faPlus = faPlus;

  @Input() isAnon: boolean;
  existingCards: ListBuyerCreditCard;
  existingCardsForm: FormGroup;
  selectedCard: BuyerCreditCard = null;
  existingPayment: Payment;
  showAdd = false;

  ngOnInit() {
    this.loadExistingPayment()
      .subscribe(res => this.handleExistingPayment(res));
  }

  loadExistingPayment(): Observable<any[]> {
    const q = [this.paymentService.List('outgoing', this.order.ID)];

    if (!this.isAnon) {
      q.push(this.meService.ListCreditCards());
    }

    return forkJoin(q);
  }

  handleExistingPayment(res: any[]) {
    const payments = res[0];
    if (payments.Items && payments.Items.length > 0) {
      this.existingPayment = payments.Items[0];
    }

    this.existingCards = this.isAnon ? null : res[1];

    if (this.isAnon && this.order.xp.cardDetails) {
      this.selectedCard = this.order.xp.cardDetails;
    }

    if (this.userHasSavedCards() && this.existingPayment) {
      this.selectedCard = this.existingCards.Items.find(x => x.ID === this.existingPayment.CreditCardID);
    }

    if (this.userHasSavedCards()) {
      this.updateForm(this.selectedCard ? this.selectedCard.ID : null);
    }

    this.showAdd = !(this.selectedCard || this.userHasSavedCards());
  }

  userHasSavedCards(): boolean {
    return !this.isAnon && this.existingCards && this.existingCards.Items.length > 0;
  }

  updateForm(cardID: string): void {
    if (!this.existingCardsForm) {
      this.existingCardsForm = this.formBuilder.group({ existingCardId: [cardID] });
    } else {
      this.existingCardsForm.setValue({ existingCardId: cardID });
    }
  }

  onAddClicked(cardDetails: CreateCardDetails) {
    if (this.isAnon) {
      this.addAnonymousCard(cardDetails);
    } else {
      this.addNewCard(cardDetails);
    }
  }

  addNewCard(cardDetails: CreateCardDetails): void {
    if (this.isAnon) { return; }
    let card: BuyerCreditCard;

    this.authorizeNetService.CreateCreditCard(cardDetails)
      .pipe(
        tap(res => card = res.ResponseBody),
        flatMap(() => this.meService.ListCreditCards())
      )
      .subscribe(cards => {
        this.existingCards = cards;
        this.selectedCard = card;
        this.updateForm(card.ID);
        this.showAdd = false;
      });
  }

  addAnonymousCard(cardDetails: CreateCardDetails) {
    this.authorizeNetService.AuthorizeAnonymousCard(this.order, cardDetails, this.existingPayment)
      .subscribe(order => {
        this.appStateService.orderSubject.next(order);
        this.selectedCard = order.xp.cardDetails;
        this.resetExistingPayment();
        this.showAdd = false;
      });
  }

  onContinueClicked() {
    if (this.isAnon || this.cardPreviouslyAuthorized()) {
      this.continue.emit();
    } else {
      this.authorizeCard();
    }
  }

  authorizeCard(): void {
    const card = <CreateCardDetails>{ CreditCardID: this.selectedCard.ID };
    this.authorizeNetService.AuthorizeCard(this.order, card, this.existingPayment)
      .subscribe(res => {
        const errorRes = <any>res;
        if (errorRes.ResponseBody.messages && errorRes.ResponseBody.messages.resultCode === 'Error') {
          this.resetExistingPayment();
          throw Error(errorRes.ResponseBody.transactionResponse.errors[0].errorText);
        }

        if (errorRes.ResponseHttpStatusCode > 400) {
          this.resetExistingPayment();
          throw Error(errorRes.ResponseBody.Message);
        }

        this.continue.emit();
      });
  }

  resetExistingPayment(): void {
    this.paymentService.List('outgoing', this.order.ID)
      .subscribe(payments => {
        if (payments.Items && payments.Items.length > 0) {
          this.existingPayment = payments.Items[0];
        } else {
          this.existingPayment = null;
        }
      });
  }

  setSelectedCard(): void {
    const id = this.existingCardsForm.value.existingCardId;
    this.selectedCard = this.existingCards.Items.find(x => x.ID === id);
  }

  cardPreviouslyAuthorized(): boolean {
    return (
      this.existingPayment
      && this.existingPayment.CreditCardID === this.selectedCard.ID
      && this.existingPayment.Transactions.length > 0
      && this.existingPayment.Transactions[0].Type === 'authOnlyTransaction'
      && this.existingPayment.Transactions[0].Succeeded
    );
  }
}
