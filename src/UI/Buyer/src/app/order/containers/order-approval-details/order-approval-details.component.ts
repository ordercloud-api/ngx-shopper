import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Order,
  ListLineItem,
  ListPayment,
  OcOrderService,
  OrderApprovalInfo,
} from '@ordercloud/angular-sdk';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { AppPaymentService } from '@app-buyer/shared/services/app-payment-service/app-payment.service';
import { map, flatMap } from 'rxjs/operators';
import { ModalService } from '@app-buyer/shared';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'order-approval-details',
  templateUrl: './order-approval-details.component.html',
  styleUrls: ['./order-approval-details.component.scss'],
})
export class OrderApprovalDetailsComponent implements OnInit {
  order$: Observable<Order>;
  lineItems$: Observable<ListLineItem>;
  lineItems: ListLineItem;
  payments$: Observable<ListPayment>;
  form: FormGroup;
  approve: boolean;
  modalID = 'order-approval-comments';

  constructor(
    private activatedRoute: ActivatedRoute,
    private appPaymentService: AppPaymentService,
    private modalService: ModalService,
    private formBuilder: FormBuilder,
    private ocOrderService: OcOrderService,
    private router: Router,
    private toasterService: ToastrService
  ) {}

  ngOnInit() {
    this.order$ = this.activatedRoute.data.pipe(
      map(({ orderResolve }) => orderResolve.order)
    );
    this.lineItems$ = this.activatedRoute.data.pipe(
      map(({ orderResolve }) => orderResolve.lineItems)
    );
    this.payments$ = this.getPayments();
    this.form = this.formBuilder.group({ comments: '' });
  }

  getPayments(): Observable<ListPayment> {
    return this.activatedRoute.paramMap.pipe(
      flatMap((params: ParamMap) =>
        this.appPaymentService.getPayments('outgoing', params.get('orderID'))
      )
    );
  }

  openModal(approve: boolean) {
    this.approve = approve;
    this.modalService.open(this.modalID);
  }

  submitReview(orderID: string) {
    const comments = this.form.value.comments;
    let request = this.ocOrderService.Approve('outgoing', orderID, <
      OrderApprovalInfo
    >{ Comments: comments, AllowResubmit: false });

    if (!this.approve) {
      request = this.ocOrderService.Decline('outgoing', orderID, <
        OrderApprovalInfo
      >{ Comments: comments, AllowResubmit: false });
    }

    request.subscribe(() => {
      this.toasterService.success(
        `Order ${orderID} was ${this.approve ? 'Approved' : 'Declined'}`
      );
      this.modalService.close(this.modalID);
      this.router.navigateByUrl('/profile/orders/approval');
    });
  }
}
