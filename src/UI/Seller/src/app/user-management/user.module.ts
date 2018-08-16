import { NgModule } from '@angular/core';
import { SharedModule } from '@app-seller/shared';

import { UserRoutingModule } from '@app-seller/user-management/user-routing.module';

@NgModule({
  imports: [SharedModule, UserRoutingModule],
  declarations: [],
})
export class UserModule {}
