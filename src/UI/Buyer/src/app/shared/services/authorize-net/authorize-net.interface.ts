import { BuyerCreditCard } from '@ordercloud/angular-sdk';

export interface CreateCardDetails {
  CardholderName: string;
  CardNumber: string;
  ExpirationDate: string;
  CardCode: string;
  CreditCardID?: string;
}

export interface CreateCardResponse {
  ResponseBody: BuyerCreditCard;
}

export interface AuthorizeCardSuccess {
  ResponseBody: AuthorizeCardResponseBody;
}

interface AuthorizeCardResponseBody {
  ChargeStatus: string;
  CreditCardID: string;
  PaymentID: string;
  TransactionID: string;
  Messages: AuthorizeResponseMessage[];
}

interface AuthorizeResponseMessage {
  code: number;
  description: string;
}
