import { NgModule } from '@angular/core';
import { SharedModule } from '@app-buyer/shared';
import { DatePipe } from '@angular/common';

import {
  OrderRoutingModule,
  MyOrdersComponent,
  OrdersToApproveComponent,
} from '@app-buyer/order/order-routing.module';
import { OrderHistoryComponent } from '@app-buyer/order/containers/order-history/order-history.component';
import { StatusFilterComponent } from '@app-buyer/order/components/status-filter/status-filter.component';
import { DateFilterComponent } from '@app-buyer/order/components/date-filter/date-filter.component';
import { OrderListComponent } from '@app-buyer/order/components/order-list/order-list.component';
import { OrderDetailsComponent } from '@app-buyer/order/containers/order-detail/order-detail.component';
import { StatusIconComponent } from '@app-buyer/order/components/status-icon/status-icon.component';
import { OrderComponent } from '@app-buyer/order/containers/order/order.component';
import { OrderShipmentsComponent } from '@app-buyer/order/containers/order-shipments/order-shipments.component';
import { OrderReorderComponent } from '@app-buyer/order/containers/order-reorder/order-reorder.component';
import { OrderApprovalComponent } from '@app-buyer/order/containers/order-approval/order-approval.component';

@NgModule({
  imports: [SharedModule, OrderRoutingModule],
  declarations: [
    OrderHistoryComponent,
    StatusFilterComponent,
    DateFilterComponent,
    OrderListComponent,
    OrderDetailsComponent,
    StatusIconComponent,
    OrderComponent,
    OrderShipmentsComponent,
    OrderReorderComponent,
    MyOrdersComponent,
    OrdersToApproveComponent,
    OrderApprovalComponent,
  ],
  providers: [
    DatePipe, // allows us to use in class as injectable (date filter component)
  ],
})
export class OrderModule {}
