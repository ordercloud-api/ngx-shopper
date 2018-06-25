import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared';
import { ProfileRoutingModule } from './profile-routing.module';

import { ProfileComponent } from './containers/profile/profile.component';
import { AddressListComponent } from './containers/address-list/address-list.component';
import { PaymentListComponent } from './containers/payment-list/payment-list.component';

@NgModule({
  imports: [
    SharedModule,
    ProfileRoutingModule,
  ],
  declarations: [
    ProfileComponent,
    AddressListComponent,
    PaymentListComponent
  ],
})
export class ProfileModule { }
