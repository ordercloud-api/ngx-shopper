import { Component, OnInit, Input, Inject } from '@angular/core';
import { CheckoutSectionBaseComponent } from '@app/checkout/components/checkout-section-base/checkout-section-base.component';
import { PaymentService, Payment, PartialPayment } from '@ordercloud/angular-sdk';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AppStateService } from '@app/shared';
import { applicationConfiguration, AppConfig } from '@app/config/app.config';
import { PaymentMethod } from '@app/shared/models/payment-method.enum';
import { flatMap, tap } from 'rxjs/operators';
import { forkJoin, Observable, of } from 'rxjs';

@Component({
  selector: 'checkout-payment',
  templateUrl: './checkout-payment.component.html',
  styleUrls: ['./checkout-payment.component.scss']
})
export class CheckoutPaymentComponent extends CheckoutSectionBaseComponent implements OnInit {

  constructor(
    private formBuilder: FormBuilder,
    private appStateService: AppStateService,
    private paymentService: PaymentService,
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
      selectedPaymentMethod: [{ value: '', disabled: this.availablePaymentMethods.length === 1 }]
    });
    this.initializePaymentMethod();
  }

  initializePaymentMethod(): void {
    this.paymentService.List('outgoing', this.order.ID)
      .subscribe(paymentList => {
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
    this.form.controls['selectedPaymentMethod'].setValue(method);
    this.selectedPaymentMethod = method;
  }

  onContinueClicked() {
    this.continue.emit()
  }

  createPayment(payment: Payment) {
    return this.deleteExistingPayments()
      .pipe(
        flatMap(() => {
          return this.paymentService.Create('outgoing', this.order.ID, payment)
            .pipe(
              tap(payment => {
                this.existingPayment = payment;
              })
            )
        })
      ).subscribe();
  }

  private deleteExistingPayments(): Observable<any[]> {
    return this.paymentService.List('outgoing', this.order.ID)
      .pipe(
        flatMap(paymentList => {
          const queue = [];
          paymentList.Items.forEach(payment => {
            queue.push(this.paymentService.Delete('outgoing', this.order.ID, payment.ID));
          })
          if (!queue.length) {
            return of([]);
          }
          return forkJoin(queue);
        })
      )
  }

  patchPayment({ paymentID, payment }: { paymentID: string, payment: PartialPayment }) {
    this.paymentService.Patch('outgoing', this.order.ID, paymentID, payment)
      .subscribe(payment => {
        this.existingPayment = payment;
      })
  }
}
