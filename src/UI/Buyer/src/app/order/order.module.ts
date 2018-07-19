import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared';

import { OrderRoutingModule } from '@app/order/order-routing.module';
import { OrderHistoryComponent } from '@app/order/containers/order-history/order-history.component';
import { StatusFilterComponent } from '@app/order/components/status-filter/status-filter.component';
import { DateFilterComponent } from '@app/order/components/date-filter/date-filter.component';
import { OrderListComponent } from '@app/order/components/order-list/order-list.component';
import { OrderDetailComponent } from '@app/order/containers/order-detail/order-detail.component';
import { StatusIconComponent } from '@app/order/components/status-icon/status-icon.component';
import { OrderComponent } from '@app/order/containers/order/order.component';
import { OrderResolve } from '@app/order/order.resolve';
import { OrderShipmentsComponent } from '@app/order/containers/order-shipments/order-shipments.component';
import { ShipmentsResolve } from '@app/order/shipments.resolve';

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
        OrderShipmentsComponent
    ],
    providers: [
        OrderResolve,
        ShipmentsResolve,
    ]
})
export class OrderModule { }
