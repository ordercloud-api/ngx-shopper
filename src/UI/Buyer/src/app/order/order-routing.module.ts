import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderDetailsComponent } from '@app-buyer/order/containers/order-detail/order-detail.component';
import { OrderComponent } from '@app-buyer/order/containers/order/order.component';
import { OrderResolve } from '@app-buyer/order/order.resolve';
import { OrderShipmentsComponent } from '@app-buyer/order/containers/order-shipments/order-shipments.component';
import { ShipmentsResolve } from '@app-buyer/order/shipments.resolve';
import { OrderApprovalDetailsComponent } from '@app-buyer/order/containers/order-approval-details/order-approval-details.component';

@Component({
  template:
    '<order-history [includeFavorites]="true" [includeStatusFilter]="true" title="My Orders"></order-history>',
})
export class MyOrdersComponent {}

@Component({
  template:
    '<order-history [includeFavorites]="false" [includeStatusFilter]="false" title="Orders To Approve"></order-history>',
})
export class OrdersToApproveComponent {}

const routes: Routes = [
  { path: '', component: MyOrdersComponent },
  { path: 'approval', component: OrdersToApproveComponent },
  {
    path: 'approval/:orderID',
    component: OrderApprovalDetailsComponent,
  },
  {
    path: ':orderID',
    component: OrderComponent,
    resolve: { orderResolve: OrderResolve },
    children: [
      { path: '', component: OrderDetailsComponent },
      {
        path: 'shipments',
        component: OrderShipmentsComponent,
        resolve: { shipmentsResolve: ShipmentsResolve },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderRoutingModule {}
