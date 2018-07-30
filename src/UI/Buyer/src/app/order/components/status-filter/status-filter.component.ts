import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { OrderStatus } from '@app-buyer/order/models/order-status.model';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'order-status-filter',
  templateUrl: './status-filter.component.html',
  styleUrls: ['./status-filter.component.scss'],
})
export class StatusFilterComponent implements OnInit {
  form: FormGroup;
  protected statuses: OrderStatus[];
  @Output() selectedStatus = new EventEmitter<OrderStatus>();

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      status: `!${OrderStatus.Unsubmitted}`,
    });
    this.statuses = [
      OrderStatus.Open,
      OrderStatus.AwaitingApproval,
      OrderStatus.Completed,
      OrderStatus.Declined,
    ];
  }

  protected selectStatus(): void {
    const status = this.form.get('status').value;
    this.selectedStatus.emit(status);
  }
}
