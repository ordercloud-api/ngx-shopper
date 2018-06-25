import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfig, applicationConfiguration } from '@app/config/app.config';
import { Observable } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import { CreateCardDetails, AuthorizeCardSuccess, CreateCardResponse } from './authorize-net.interface';
import { TokenService, Payment, PaymentService, Order, OrderService, BuyerCreditCard } from '@ordercloud/angular-sdk';

@Injectable()
export class AuthorizeNetService {

  readonly url = 'https://api.ordercloud.io/v1/integrationproxy/authorizenet';
  readonly options = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${this.tokenSerivce.GetAccess()}`
    })
  };
  readonly acceptedCards = {
    'Visa': RegExp('^4[0-9]{12}(?:[0-9]{3})?$'), // e.g. 4000000000000000
    'MasterCard': RegExp('^5[1-5][0-9]{14}$'), // e.g. 5100000000000000
    'Discover': RegExp('^6(?:011|5[0-9]{2})[0-9]{12}$') // e.g. 6011000000000000
  };

  constructor(
    private http: HttpClient,
    private tokenSerivce: TokenService,
    private paymentService: PaymentService,
    private orderService: OrderService,
    @Inject(applicationConfiguration) private appConfig: AppConfig
  ) { }

  private post(body) {
    return this.http.post<any>(this.url, body, this.options);
  }

  CreateCreditCard(card: CreateCardDetails): Observable<CreateCardResponse> {
    return this.post({
      BuyerID: this.appConfig.appname,
      TransactionType: 'createCreditCard',
      CardDetails: {
        CardType: this.getCardType(card.CardNumber),
        ...card,
        Shared: false
      }
    });
  }

  DeleteCreditCard(cardID: string) {
    return this.post({
      BuyerID: this.appConfig.appname,
      TransactionType: 'deleteCreditCard',
      CardDetails: {
        CreditCardID: cardID,
        Shared: false,
      }
    });
  }

  private AuthorizeCardOnOrder(order: Order, card: CreateCardDetails): Observable<AuthorizeCardSuccess> {
    return this.post({
      BuyerID: this.appConfig.appname,
      OrderID: order.ID,
      OrderDirection: 'outgoing',
      Amount: order.Total,
      TransactionType: 'authOnlyTransaction',
      CardDetails: {
        ...card,
        Shared: false,
      }
    });
  }

  CaptureTransaction(orderId: string, paymentId: string) {
    return this.post({
      BuyerID: this.appConfig.appname,
      OrderID: orderId,
      OrderDirection: 'outgoing',
      TransactionType: 'priorAuthCaptureTransaction',
      CardDetails: {
        PaymentID: paymentId
      }
    });
  }
  /**
    The OC API integration with Authorize.Net is still working through some bugs. One involves existing Payments.
    This function wraps AuthorizeCardOnOrder() with the calls needed to work around this bug.
  */
  AuthorizeCard(order: Order, card: CreateCardDetails, existingPayment: Payment): Observable<AuthorizeCardSuccess> {
    if (!existingPayment) {
      return this.AuthorizeCardOnOrder(order, card);
    }

    return this.paymentService.Delete('outgoing', order.ID, existingPayment.ID)
      .pipe(
        flatMap(() => this.AuthorizeCardOnOrder(order, card))
      );
  }

  /**
    Use AuthorizeAnonymousCard() for anonymous shoppers.
    These cards' non-sensitive details are not saved to a user, because no user exists.
    Instead they must be saved on the order xp.
  */
  AuthorizeAnonymousCard(order: Order, card: CreateCardDetails, existingPayment: Payment): Observable<Order> {
    return this.AuthorizeCard(order, card, existingPayment)
      .pipe(
        flatMap(() => this.orderService.Patch('outgoing', order.ID, { xp: { cardDetails: this.mapToNonSensitive(card) } }))
      );
  }

  getCardType(cardNumber: string): string {
    if (!cardNumber) { return null; }

    for (const type in this.acceptedCards) {
      if (this.acceptedCards.hasOwnProperty(type)) {
        if (this.acceptedCards[type].test(cardNumber)) {
          return type;
        }
      }
    }
    throw Error('Card number does not match accepted credit card companies');
  }

  mapToNonSensitive(card: CreateCardDetails): BuyerCreditCard {
    return {
      CardType: this.getCardType(card.CardNumber),
      PartialAccountNumber: card.CardNumber.slice(-4),
      CardholderName: card.CardholderName,
      ExpirationDate: card.ExpirationDate
    };
  }
}
