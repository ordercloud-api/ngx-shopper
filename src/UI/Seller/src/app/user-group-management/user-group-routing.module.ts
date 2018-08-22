// core services
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserGroupTableComponent } from '@app-seller/user-group-management/containers/user-group-table/user-group-table.component';
import { UserGroupDetailsComponent } from '@app-seller/user-group-management/containers/user-group-details/user-group-details.component';

const routes: Routes = [
  { path: '', component: UserGroupTableComponent },
  { path: ':userGroupID', component: UserGroupDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserGroupRoutingModule {}
