import { NgModule } from '@angular/core';
import { SharedModule } from '@app-seller/shared';

import { UserRoutingModule } from '@app-seller/user-management/user-routing.module';
import { UserTableComponent } from '@app-seller/user-management/container/user-table/user-table.component';
import { UserFormComponent } from '@app-seller/user-management/components/user-form/user-form.component';

@NgModule({
  imports: [SharedModule, UserRoutingModule],
  declarations: [UserTableComponent, UserFormComponent],
})
export class UserModule {}
