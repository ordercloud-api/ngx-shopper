import { NgModule } from '@angular/core';
import { SharedModule } from '@app-buyer/shared';

import { OrderRoutingModule } from '@app-buyer/order/order-routing.module';
import { OrderHistoryComponent } from '@app-buyer/order/containers/order-history/order-history.component';
import { StatusFilterComponent } from '@app-buyer/order/components/status-filter/status-filter.component';
import { DateFilterComponent } from '@app-buyer/order/components/date-filter/date-filter.component';
import { OrderListComponent } from '@app-buyer/order/components/order-list/order-list.component';
import { OrderDetailComponent } from '@app-buyer/order/containers/order-detail/order-detail.component';
import { StatusIconComponent } from '@app-buyer/order/components/status-icon/status-icon.component';
import { OrderComponent } from '@app-buyer/order/containers/order/order.component';
import { OrderResolve } from '@app-buyer/order/order.resolve';
import { OrderShipmentsComponent } from '@app-buyer/order/containers/order-shipments/order-shipments.component';
import { ShipmentsResolve } from '@app-buyer/order/shipments.resolve';
import { OrderAprovalComponent } from '@app-buyer/order/containers/order-approval/order-approval.component';
import { OrderApprovalDetailsComponent } from './containers/order-approval-details/order-approval-details.component';

@NgModule({
  imports: [SharedModule, OrderRoutingModule],
  declarations: [
    OrderHistoryComponent,
    StatusFilterComponent,
    DateFilterComponent,
    OrderListComponent,
    OrderDetailComponent,
    StatusIconComponent,
    OrderComponent,
    OrderShipmentsComponent,
    OrderAprovalComponent,
    OrderApprovalDetailsComponent,
  ],
  providers: [OrderResolve, ShipmentsResolve],
})
export class OrderModule {}
