// core services
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ProfileComponent } from '@app-buyer/profile/containers/profile/profile.component';
import { AddressListComponent } from '@app-buyer/profile/containers/address-list/address-list.component';
import { MeUpdateComponent } from '@app-buyer/profile/containers/me-update/me-update.component';
import { PaymentListComponent } from '@app-buyer/profile/containers/payment-list/payment-list.component';

const routes: Routes = [
  {
    path: '',
    component: ProfileComponent,
    children: [
      { path: '', redirectTo: 'details' },
      { path: 'details', component: MeUpdateComponent },
      { path: 'addresses', component: AddressListComponent },
      { path: 'payment-methods', component: PaymentListComponent },
      { path: 'orders', loadChildren: () => import('../order/order.module').then(m => m.OrderModule) },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileRoutingModule {}
