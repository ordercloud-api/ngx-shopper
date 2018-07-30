// core services
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

// checkout components
import { CartComponent } from '@app-buyer/checkout/containers/cart/cart.component';
import { CheckoutAddressComponent } from '@app-buyer/checkout/containers/checkout-address/checkout-address.component';
import { CheckoutComponent } from '@app-buyer/checkout/containers/checkout/checkout.component';
import { CheckoutSectionBaseComponent } from '@app-buyer/checkout/components/checkout-section-base/checkout-section-base.component';
import { OrderSummaryComponent } from '@app-buyer/checkout/components/order-summary/order-summary.component';

// shared module
import { SharedModule } from '@app-buyer/shared';

// checkout routing
import { CheckoutRoutingModule } from '@app-buyer/checkout/checkout-routing.module';
import { CheckoutPaymentComponent } from '@app-buyer/checkout/containers/checkout-payment/checkout-payment.component';
import { PaymentPurchaseOrderComponent } from '@app-buyer/checkout/components/payment-purchase-order/payment-purchase-order.component';
import { PaymentSpendingAccountComponent } from '@app-buyer/checkout/components/payment-spending-account/payment-spending-account.component';
import { OrderConfirmationComponent } from '@app-buyer/checkout/containers/order-confirmation/order-confirmation.component';
import { CheckoutConfirmComponent } from '@app-buyer/checkout/components/checkout-confirm/checkout-confirm.component';

@NgModule({
  imports: [SharedModule, CheckoutRoutingModule, FormsModule],
  declarations: [
    CartComponent,
    CheckoutAddressComponent,
    CheckoutComponent,
    CheckoutSectionBaseComponent,
    OrderSummaryComponent,
    CheckoutPaymentComponent,
    PaymentPurchaseOrderComponent,
    PaymentSpendingAccountComponent,
    OrderConfirmationComponent,
    CheckoutConfirmComponent,
  ],
})
export class CheckoutModule {}
