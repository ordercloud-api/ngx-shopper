import { Pipe, PipeTransform } from '@angular/core';
import { OrderStatus, OrderStatusMap } from '../../../order/models/order-status.model';

@Pipe({
  name: 'orderStatus'
})
export class OrderStatusPipe implements PipeTransform {
  transform(status: OrderStatus) {
    if (!status) { return null; }
    return OrderStatusMap[status];
  }
}
