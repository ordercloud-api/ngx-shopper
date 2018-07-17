// core services
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

// checkout components
import { CartComponent } from '@app/checkout/containers/cart/cart.component';
import { CheckoutAddressComponent } from '@app/checkout/containers/checkout-address/checkout-address.component';
import { CheckoutComponent } from '@app/checkout/containers/checkout/checkout.component';
import { CheckoutSectionBaseComponent } from '@app/checkout/components/checkout-section-base/checkout-section-base.component';
import { OrderSummaryComponent } from '@app/checkout/components/order-summary/order-summary.component';

// shared module
import { SharedModule } from '@app/shared';

// checkout routing
import { CheckoutRoutingModule } from '@app/checkout/checkout-routing.module';
import { CheckoutPaymentComponent } from '@app/checkout/containers/checkout-payment/checkout-payment.component';
import { PaymentPurchaseOrderComponent } from '@app/checkout/components/payment-purchase-order/payment-purchase-order.component';
import { PaymentSpendingAccountComponent } from '@app/checkout/components/payment-spending-account/payment-spending-account.component';
import { OrderConfirmationComponent } from '@app/checkout/containers/order-confirmation/order-confirmation.component';
import { CheckoutConfirmComponent } from './components/checkout-confirm/checkout-confirm.component';

@NgModule({
    imports: [
        SharedModule,
        CheckoutRoutingModule,
        FormsModule
    ],
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
        CheckoutConfirmComponent
    ]
})
export class CheckoutModule { }
