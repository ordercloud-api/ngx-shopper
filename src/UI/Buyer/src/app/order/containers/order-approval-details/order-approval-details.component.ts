import { Component, OnInit } from '@angular/core';
import { OcOrderService, OrderApprovalInfo } from '@ordercloud/angular-sdk';
import { ActivatedRoute, Router } from '@angular/router';
import { AppPaymentService } from '@app-buyer/shared/services/app-payment-service/app-payment.service';
import { ModalService, AppLineItemService } from '@app-buyer/shared';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { OrderDetailsComponent } from '@app-buyer/order/containers/order-detail/order-detail.component';

@Component({
  selector: 'order-approval-details',
  templateUrl: './order-approval-details.component.html',
  styleUrls: ['./order-approval-details.component.scss'],
})
export class OrderApprovalDetailsComponent extends OrderDetailsComponent
  implements OnInit {
  form: FormGroup;
  approve: boolean;
  modalID = 'order-approval-comments';

  constructor(
    private modalService: ModalService,
    private formBuilder: FormBuilder,
    private router: Router,
    private toasterService: ToastrService,
    protected activatedRoute: ActivatedRoute,
    protected appPaymentService: AppPaymentService,
    protected appLineItemService: AppLineItemService,
    protected ocOrderService: OcOrderService
  ) {
    super(
      activatedRoute,
      ocOrderService,
      appPaymentService,
      appLineItemService
    );
  }

  ngOnInit() {
    super.ngOnInit();
    this.form = this.formBuilder.group({ comments: '' });
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
