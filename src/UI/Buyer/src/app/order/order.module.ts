import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared';

import { OrderRoutingModule } from './order-routing.module';
import { OrderHistoryComponent } from './containers/order-history/order-history.component';
import { StatusFilterComponent } from './components/status-filter/status-filter.component';
import { DateFilterComponent } from './components/date-filter/date-filter.component';
import { OrderListComponent } from './components/order-list/order-list.component';
import { OrderDetailComponent } from './containers/order-detail/order-detail.component';
import { StatusIconComponent } from './components/status-icon/status-icon.component';
import { OrderComponent } from './containers/order/order.component';
import { OrderResolve } from '@app/order/order.resolve';
import { OrderShipmentsComponent } from './containers/order-shipments/order-shipments.component';
import { ShipmentsResolve } from '@app/order/shipments.resolve';
import { PaymentListComponent } from './components/payment-list/payment-list.component';

@NgModule({
    imports: [
        SharedModule,
        OrderRoutingModule
    ],
    declarations: [
        OrderHistoryComponent,
        StatusFilterComponent,
        DateFilterComponent,
        OrderListComponent,
        OrderDetailComponent,
        StatusIconComponent,
        OrderComponent,
        OrderShipmentsComponent,
        PaymentListComponent,
    ],
    providers: [
        OrderResolve,
        ShipmentsResolve,
    ]
})
export class OrderModule { }
