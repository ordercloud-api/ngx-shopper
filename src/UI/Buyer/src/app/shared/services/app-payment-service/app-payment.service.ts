import { Injectable } from '@angular/core';
import {
  ListPayment,
  OcPaymentService,
  OcMeService,
  Payment,
} from '@ordercloud/angular-sdk';
import { Observable, of, forkJoin } from 'rxjs';
import { map, flatMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class AppPaymentService {
  constructor(
    private ocPaymentService: OcPaymentService,
    private ocMeService: OcMeService
  ) {}

  getPayments(direction: string, orderID: string): Observable<ListPayment> {
    return this.ocPaymentService.List(direction, orderID).pipe(
      flatMap((paymentList) => {
        const requests = paymentList.Items.map((payment) =>
          this.getPaymentDetails(payment)
        );
        return forkJoin(requests).pipe(
          map((res) => {
            res.forEach((details, index) => {
              // put details for each payment type on payment.Details
              (paymentList.Items[index] as any).Details = details;
            });
            return paymentList;
          })
        );
      })
    );
  }

  private getPaymentDetails(payment: Payment): Observable<any> {
    switch (payment.Type) {
      case 'CreditCard':
        return this.ocMeService.GetCreditCard(payment.CreditCardID);
      case 'SpendingAccount':
        return this.ocMeService.GetSpendingAccount(payment.SpendingAccountID);
      case 'PurchaseOrder':
        return of({ PONumber: payment.xp.PONumber });
    }
  }
}
