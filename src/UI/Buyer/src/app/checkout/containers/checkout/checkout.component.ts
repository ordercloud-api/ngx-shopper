import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { Order, OcOrderService } from '@ordercloud/angular-sdk';
import { AppStateService, BaseResolveService } from '@app-buyer/shared';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { NgbAccordion } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { AppErrorHandler } from '@app-buyer/config/error-handling.config';
import { flatMap } from 'rxjs/operators';

@Component({
  selector: 'checkout-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss'],
})
export class CheckoutComponent implements OnInit {
  @ViewChild('acc', { static: false }) public accordian: NgbAccordion;
  currentOrder$: Observable<Order> = this.appStateService.orderSubject;
  isAnon: boolean;
  isSubmittingOrder = false;
  currentPanel: string;
  faCheck = faCheck;
  sections: any = [
    {
      id: 'login',
      valid: false,
    },
    {
      id: 'shippingAddress',
      valid: false,
    },
    {
      id: 'billingAddress',
      valid: false,
    },
    {
      id: 'payment',
      valid: false,
    },
    {
      id: 'confirm',
      valid: false,
    },
  ];

  constructor(
    private appStateService: AppStateService,
    private ocOrderService: OcOrderService,
    private router: Router,
    private baseResolveService: BaseResolveService,
    private appErrorHandler: AppErrorHandler
  ) {}

  ngOnInit() {
    this.isAnon = this.appStateService.isAnonSubject.value;
    this.currentPanel = this.isAnon ? 'login' : 'shippingAddress';
    this.setValidation('login', !this.isAnon);
  }

  getValidation(id: string) {
    return this.sections.find((x) => x.id === id).valid;
  }

  setValidation(id: string, value: boolean) {
    this.sections.find((x) => x.id === id).valid = value;
  }

  toSection(id: string) {
    const prevIdx = Math.max(
      this.sections.findIndex((x) => x.id === id) - 1,
      0
    );
    const prev = this.sections[prevIdx].id;
    this.setValidation(prev, true);
    this.accordian.toggle(id);
  }

  submitOrder() {
    this.isSubmittingOrder = true;
    const orderID = this.appStateService.orderSubject.value.ID;
    this.ocOrderService
      .Get('outgoing', orderID)
      .pipe(
        flatMap((order) => {
          if (order.IsSubmitted) {
            return throwError({ message: 'Order has already been submitted' });
          }
          return this.ocOrderService.Submit('outgoing', orderID);
        })
      )
      .subscribe(
        () => {
          this.router.navigateByUrl(`order-confirmation/${orderID}`);
          this.baseResolveService.resetUser();
        },
        (ex) => {
          // order submit error occurred
          this.isSubmittingOrder = false;
          this.appErrorHandler.displayError(ex);
        }
      );
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
