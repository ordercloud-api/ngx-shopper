import { NgModule } from '@angular/core';
import { SharedModule } from '@app-buyer/shared';
import { ProfileRoutingModule } from '@app-buyer/profile/profile-routing.module';

import { ProfileComponent } from '@app-buyer/profile/containers/profile/profile.component';
import { AddressListComponent } from '@app-buyer/profile/containers/address-list/address-list.component';
import { PaymentListComponent } from '@app-buyer/profile/containers/payment-list/payment-list.component';

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
