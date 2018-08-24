import { NgModule } from '@angular/core';
import { SharedModule } from '@app-seller/shared';

import { UserGroupTableComponent } from './containers/user-group-table/user-group-table.component';
import { UserGroupRoutingModule } from '@app-seller/user-group-management/user-group-routing.module';
import { UserGroupFormComponent } from '@app-seller/user-group-management/components/user-group-form/user-group-form.component';
import { UserGroupDetailsComponent } from './containers/user-group-details/user-group-details.component';

@NgModule({
  imports: [SharedModule, UserGroupRoutingModule],
  declarations: [UserGroupTableComponent, UserGroupFormComponent, UserGroupDetailsComponent],
})
export class UserGroupModule {}
