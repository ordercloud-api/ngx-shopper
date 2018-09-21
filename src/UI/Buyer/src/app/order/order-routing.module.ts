import { NgModule, Component } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderDetailsComponent } from '@app-buyer/order/containers/order-detail/order-detail.component';
import { OrderComponent } from '@app-buyer/order/containers/order/order.component';
import { OrderShipmentsComponent } from '@app-buyer/order/containers/order-shipments/order-shipments.component';
import { ShipmentsResolve } from '@app-buyer/order/shipments.resolve';
import { OrderResolve } from '@app-buyer/order/order.resolve';

@Component({
  template: '<order-history [approvalVersion]="false"></order-history>',
})
export class MyOrdersComponent {}

@Component({
  template: '<order-history [approvalVersion]="true"></order-history>',
})
export class OrdersToApproveComponent {}

const routes: Routes = [
  { path: '', component: MyOrdersComponent },
  { path: 'approval', component: OrdersToApproveComponent },
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
  {
    path: 'approval/:orderID',
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
