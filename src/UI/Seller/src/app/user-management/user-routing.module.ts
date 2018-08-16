// core services
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserTableComponent } from '@app-seller/shared/containers/user-table/user-table.component';

const routes: Routes = [
  { path: '', component: UserTableComponent },
  //{ path: ':productID', component: ProductDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class UserRoutingModule {}
