import { Component, OnInit, Input, Inject } from '@angular/core';
import { CheckoutSectionBaseComponent } from '@app-buyer/checkout/components/checkout-section-base/checkout-section-base.component';
import {
  OcPaymentService,
  Payment,
  PartialPayment,
} from '@ordercloud/angular-sdk';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AppStateService } from '@app-buyer/shared';
import {
  applicationConfiguration,
  AppConfig,
} from '@app-buyer/config/app.config';
import { PaymentMethod } from '@app-buyer/shared/models/payment-method.enum';
import { flatMap, tap } from 'rxjs/operators';
import { forkJoin, Observable, of } from 'rxjs';

@Component({
  selector: 'checkout-payment',
  templateUrl: './checkout-payment.component.html',
  styleUrls: ['./checkout-payment.component.scss'],
})
export class CheckoutPaymentComponent extends CheckoutSectionBaseComponent
  implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private appStateService: AppStateService,
    private ocPaymentService: OcPaymentService,
    @Inject(applicationConfiguration) private appConfig: AppConfig
  ) {
    super();
  }

  @Input() isAnon: boolean;
  readonly order = this.appStateService.orderSubject.value;
  form: FormGroup;
  availablePaymentMethods = this.appConfig.availablePaymentMethods;
  selectedPaymentMethod: PaymentMethod;
  existingPayment: Payment;

  ngOnInit() {
    this.form = this.formBuilder.group({
      selectedPaymentMethod: [
        { value: '', disabled: this.availablePaymentMethods.length === 1 },
      ],
    });
    this.initializePaymentMethod();
  }

  initializePaymentMethod(): void {
    if (this.availablePaymentMethods.length === 1) {
      this.selectedPaymentMethod = this.availablePaymentMethods[0];
    }
    this.ocPaymentService
      .List('outgoing', this.order.ID)
      .subscribe((paymentList) => {
        if (paymentList.Items && paymentList.Items.length > 0) {
          this.existingPayment = paymentList.Items[0];
        } else {
          this.existingPayment = null;
        }

        if (this.existingPayment) {
          this.selectPaymentMethod(this.existingPayment.Type as PaymentMethod);
        } else {
          this.selectPaymentMethod(this.availablePaymentMethods[0]);
        }
      });
  }

  selectPaymentMethod(method: PaymentMethod): void {
    if (method) {
      this.form.controls['selectedPaymentMethod'].setValue(method);
    }
    this.selectedPaymentMethod = this.form.get('selectedPaymentMethod').value;
    if (
      this.selectedPaymentMethod !== PaymentMethod.SpendingAccount &&
      this.existingPayment &&
      this.existingPayment.SpendingAccountID
    ) {
      this.existingPayment = null;
      this.deleteExistingPayments().subscribe();
    }
  }

  onContinueClicked() {
    this.continue.emit();
  }

  createPayment(payment: Payment) {
    return this.deleteExistingPayments()
      .pipe(
        flatMap(() => {
          return this.ocPaymentService
            .Create('outgoing', this.order.ID, payment)
            .pipe(
              tap((paymentResult) => {
                this.existingPayment = paymentResult;
              })
            );
        })
      )
      .subscribe();
  }

  private deleteExistingPayments(): Observable<any[]> {
    return this.ocPaymentService.List('outgoing', this.order.ID).pipe(
      flatMap((paymentList) => {
        if (!paymentList.Items.length) {
          return of([]);
        }
        const requests = paymentList.Items.map((payment) =>
          this.ocPaymentService.Delete('outgoing', this.order.ID, payment.ID)
        );

        return forkJoin(requests);
      })
    );
  }

  patchPayment({
    paymentID,
    payment,
  }: {
    paymentID: string;
    payment: PartialPayment;
  }) {
    this.ocPaymentService
      .Patch('outgoing', this.order.ID, paymentID, payment)
      .subscribe((paymentResult) => {
        this.existingPayment = paymentResult;
      });
  }
}
