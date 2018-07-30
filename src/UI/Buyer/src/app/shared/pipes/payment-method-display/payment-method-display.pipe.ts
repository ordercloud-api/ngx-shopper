import { Pipe, PipeTransform } from '@angular/core';
import {
  PaymentMethod,
  PaymentMethodMap,
} from '@app-buyer/shared/models/payment-method.enum';

@Pipe({
  name: 'paymentMethodDisplay',
})
export class PaymentMethodDisplayPipe implements PipeTransform {
  transform(method: PaymentMethod) {
    if (!method) {
      return null;
    }
    return PaymentMethodMap[method];
  }
}
