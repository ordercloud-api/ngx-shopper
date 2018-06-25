import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrderHistoryComponent } from './containers/order-history/order-history.component';
import { OrderDetailComponent } from '@app/order/containers/order-detail/order-detail.component';
import { OrderComponent } from '@app/order/containers/order/order.component';
import { OrderResolve } from './order.resolve';
import { OrderShipmentsComponent } from '@app/order/containers/order-shipments/order-shipments.component';
import { ShipmentsResolve } from '@app/order/shipments.resolve';

const routes: Routes = [
    { path: '', component: OrderHistoryComponent },
    {
        path: ':orderID', component: OrderComponent, resolve: { orderResolve: OrderResolve }, children: [
            { path: '', component: OrderDetailComponent },
            { path: 'shipments', component: OrderShipmentsComponent, resolve: { shipmentsResolve: ShipmentsResolve } }
        ]
    },
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule],
})
export class OrderRoutingModule { }
