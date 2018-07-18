import { Pipe, PipeTransform } from '@angular/core';
import { OrderStatus, OrderStatusMap } from '@app/order/models/order-status.model';

@Pipe({
  name: 'orderStatusDisplay'
})
export class OrderStatusDisplayPipe implements PipeTransform {
  transform(status: OrderStatus) {
    if (!status) { return null; }
    return OrderStatusMap[status];
  }
}
