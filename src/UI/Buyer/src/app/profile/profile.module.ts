import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared';
import { ProfileRoutingModule } from '@app/profile/profile-routing.module';

import { ProfileComponent } from '@app/profile/containers/profile/profile.component';
import { AddressListComponent } from '@app/profile/containers/address-list/address-list.component';
import { PaymentListComponent } from '@app/profile/containers/payment-list/payment-list.component';

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
