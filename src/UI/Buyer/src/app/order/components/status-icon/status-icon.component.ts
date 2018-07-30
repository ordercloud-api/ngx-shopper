import { Component, Input } from '@angular/core';
import { faCircle, faClock, faBan } from '@fortawesome/free-solid-svg-icons';
import { OrderStatus } from '@app-buyer/order/models/order-status.model';

@Component({
  selector: 'order-status-icon',
  templateUrl: './status-icon.component.html',
  styleUrls: ['./status-icon.component.scss'],
})
export class StatusIconComponent {
  @Input() status: OrderStatus;
  faCircle = faCircle;
  faClock = faClock;
  faBan = faBan;
  statusIconMapping = {
    [OrderStatus.Completed]: this.faCircle,
    [OrderStatus.AwaitingApproval]: this.faClock,
    [OrderStatus.Open]: this.faCircle,
    [OrderStatus.Declined]: this.faBan,
  };
}
