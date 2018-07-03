import { Component, OnInit } from '@angular/core';
import { PaymentBaseComponent } from '@app/checkout/components/payment-base/payment-base.component';
import { Observable } from 'rxjs';
import { SpendingAccount, ListSpendingAccount, MeService, Payment } from '@ordercloud/angular-sdk';
import { map, tap } from 'rxjs/operators';

@Component({
  selector: 'checkout-payment-spending-account',
  templateUrl: './payment-spending-account.component.html',
  styleUrls: ['./payment-spending-account.component.scss']
})
export class PaymentSpendingAccountComponent extends PaymentBaseComponent implements OnInit {

  spendingAccounts$: Observable<ListSpendingAccount>;
  selectedSpendingAccount: SpendingAccount = null;

  constructor(private meService: MeService) {
    super();
   }

  ngOnInit() {
    this.spendingAccounts$ = this.meService.ListSpendingAccounts().pipe(
      map(accounts => this.filterByDate(accounts)),
      tap(accounts => this.selectedSpendingAccount = this.setSavedSpendingAccount(accounts))
    );
  }

  setSavedSpendingAccount(accounts: ListSpendingAccount): SpendingAccount  {
    if (this.payment && this.payment.SpendingAccountID) {
      const saved = accounts.Items.filter(x => x.ID === this.payment.SpendingAccountID);
      if (saved.length > 0) {
        return saved[0];
      }
    }
    return null;
  }

  filterByDate(accounts: ListSpendingAccount): ListSpendingAccount {
    const now = new Date();
    accounts.Items = accounts.Items.filter(x => {
      const open = !x.EndDate || new Date(x.EndDate) < now;
      const notExpired = !x.StartDate || now < new Date(x.StartDate);
      return open && notExpired;
    });
    return accounts;
  }

  accountSelected(account: SpendingAccount): void {
    this.selectedSpendingAccount = account;
    const payment: Payment = {
      Type: 'SpendingAccount',
      SpendingAccountID: account.ID,
      Amount: this.order.Total,
      Accepted: true
    };
    this.paymentCreated.emit(payment);
  }

  validateAndContinue() {
    if (this.selectedSpendingAccount.Balance < this.order.Total) {
      throw Error(`This spending account has insuficient funds`);
    }
    if (this.selectedSpendingAccount.AllowAsPaymentMethod) {
      throw Error(`This spending account is not an allowed payment method.`);
    }
    this.continue.emit();
  }

}
