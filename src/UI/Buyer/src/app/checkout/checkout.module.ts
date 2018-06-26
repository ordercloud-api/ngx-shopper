// core services
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

// checkout components
import { CartComponent } from './containers/cart/cart.component';
import { CheckoutAddressComponent } from './containers/checkout-address/checkout-address.component';
import { CheckoutComponent } from './containers/checkout/checkout.component';
import { CheckoutSectionBaseComponent } from './components/checkout-section-base/checkout-section-base.component';
import { OrderConfirmationComponent } from './containers/order-confirmation/order-confirmation.component';
import { OrderSummaryComponent } from './components/order-summary/order-summary.component';

// shared module
import { SharedModule } from '@app/shared';

// checkout routing
import { CheckoutRoutingModule } from './checkout-routing.module';
import { CheckoutPaymentComponent } from './containers/checkout-payment/checkout-payment.component';
import { PaymentPurchaseOrderComponent } from './components/payment-purchase-order/payment-purchase-order.component';

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
        OrderConfirmationComponent,
        OrderSummaryComponent,
        CheckoutPaymentComponent,
        PaymentPurchaseOrderComponent,
    ]
})
export class CheckoutModule { }
