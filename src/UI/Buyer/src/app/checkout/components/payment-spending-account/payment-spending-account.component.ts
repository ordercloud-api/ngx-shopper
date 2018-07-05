import { Component, OnInit } from '@angular/core';
import { PaymentBaseComponent } from '@app/checkout/components/payment-base/payment-base.component';
import { Observable } from 'rxjs';
import { SpendingAccount, ListSpendingAccount, MeService, Payment } from '@ordercloud/angular-sdk';
import { tap } from 'rxjs/operators';
import * as moment from 'moment';

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
    const now = moment().format('YYYY-MM-DD');
    const dateFilter = { StartDate: `>${now}|!*`, EndDate: `<${now}|!*` };
    this.spendingAccounts$ = this.meService.ListSpendingAccounts({ filters: dateFilter }).pipe(
      tap(accounts => this.selectedSpendingAccount = this.getSavedSpendingAccount(accounts))
    );
  }

  getSavedSpendingAccount(accounts: ListSpendingAccount): SpendingAccount  {
    if (this.payment && this.payment.SpendingAccountID) {
      const saved = accounts.Items.filter(x => x.ID === this.payment.SpendingAccountID);
      if (saved.length > 0) {
        return saved[0];
      }
    }
    return null;
  }

  accountSelected(account: SpendingAccount): void {
    this.selectedSpendingAccount = account;
    const payment: Payment = {
      Type: 'SpendingAccount',
      SpendingAccountID: account.ID,
      Accepted: true
    };
    this.paymentCreated.emit(payment);
  }

  validateAndContinue() {
    if (this.selectedSpendingAccount.Balance < this.order.Total) {
      throw Error('This spending account has insuficient funds');
    }
    if (!this.selectedSpendingAccount.AllowAsPaymentMethod) {
      throw Error('This spending account is not an allowed payment method.');
    }
    this.continue.emit();
  }

}
