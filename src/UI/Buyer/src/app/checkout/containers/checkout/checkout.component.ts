import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import { Order, OrderService, PaymentService, ListPayment } from '@ordercloud/angular-sdk';
import { AppStateService, AuthorizeNetService, BaseResolveService } from '@app/shared';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { NgbAccordion } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';

@Component({
  selector: 'checkout-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {
  @ViewChild('acc') public accordian: NgbAccordion;
  currentOrder$: Observable<Order> = this.appStateService.orderSubject;
  isAnon: boolean;
  currentPanel: string;
  faCheck = faCheck;
  sections: any = [
    {
      id: 'login',
      valid: false
    },
    {
      id: 'address',
      valid: false
    },
    {
      id: 'payment',
      valid: false
    },
    {
      id: 'confirm',
      valid: false
    }
  ];

  constructor(
    private appStateService: AppStateService,
    private orderService: OrderService,
    private router: Router,
    private authNetService: AuthorizeNetService,
    private paymentService: PaymentService,
    private baseResolveService: BaseResolveService
  ) { }

  ngOnInit() {
    this.isAnon = this.appStateService.isAnonSubject.value;
    this.currentPanel = this.isAnon ? 'login' : 'address';
    this.setValidation('login', !this.isAnon);
  }

  getValidation(id: string) {
    return this.sections.find(x => x.id === id).valid;
  }

  setValidation(id: string, value: boolean) {
    this.sections.find(x => x.id === id).valid = value;
  }

  toSection(id: string) {
    const prevIdx = Math.max(this.sections.findIndex(x => x.id === id) - 1, 0);
    const prev = this.sections[prevIdx].id;
    this.setValidation(prev, true);
    this.accordian.toggle(id);
  }

  confirmOrder() {
    const orderID = this.appStateService.orderSubject.value.ID;
    // TODO - this could be refactored to avoid calling the api to get paymentID.
    this.paymentService.List('outgoing', orderID)
      .pipe(
        flatMap((payments: ListPayment) => this.authNetService.CaptureTransaction(orderID, payments.Items[0].ID)),
        flatMap(() => this.orderService.Submit('outgoing', orderID))
      )
      .subscribe(() => {
        this.router.navigateByUrl(`order-confirmation/${orderID}`);
        this.baseResolveService.resetUser();
      },
        error => {
          throw Error(error);
        });
  }

  beforeChange($event) {
    if (this.currentPanel === $event.panelId) {
      return $event.preventDefault();
    }

    // Only allow a section to open if all previous sections are valid
    for (const section of this.sections) {
      if (section.id === $event.panelId) {
        break;
      }

      if (!section.valid) {
        return $event.preventDefault();
      }
    }
    this.currentPanel = $event.panelId;
  }
}
