import { Injectable } from '@angular/core';
import { ListPayment, PaymentService, MeService } from '@ordercloud/angular-sdk';
import { Observable, of, forkJoin } from 'rxjs';
import { tap, map, flatMap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AppPaymentService {

  constructor(
    private paymentService: PaymentService,
    private meService: MeService
  ) { }

  getPayments(direction: string, orderID: string): Observable<ListPayment> {
    return this.paymentService.List(direction, orderID)
      .pipe(
        flatMap(paymentList => {
          // put details for each payment type on payment.Details
          let queue = [];
          paymentList.Items.forEach(payment => {
            if (payment.Type === 'CreditCard') {
              queue = [...queue, (() => {
                return this.meService.GetCreditCard(payment.CreditCardID)
                  .pipe(
                    tap(creditCard => {
                      payment['Details'] = creditCard;
                    })
                  );
              })()];
            } else if (payment.Type === 'SpendingAccount') {
              queue = [...queue, (() => {
                return this.meService.GetSpendingAccount(payment.SpendingAccountID)
                  .pipe(
                    tap(spendingAccount => {
                      payment['Details'] = spendingAccount;
                    })
                  );
              })()];
            } else {
              payment['Details'] = { PONumber: payment.xp.PONumber };
              queue = [...queue, of(null)];
            }
          });
          return forkJoin(queue)
            .pipe(
              map(() => paymentList)
            );
        })
      );
  }
}
