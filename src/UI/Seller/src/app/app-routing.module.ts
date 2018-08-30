// components
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HasTokenGuard as HasToken } from '@app-seller/shared';
import { HomeComponent } from '@app-seller/layout/home/home.component';
import { UserTableComponent } from '@app-seller/shared/containers/user-table/user-table.component';
import { AddressTableComponent } from '@app-seller/shared/containers/address-table/address-table.component';
import { CategoryManagementComponent } from '@app-seller/shared/containers/category-management/category-management.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [HasToken],
    children: [
      { path: '', redirectTo: '/home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      {
        path: 'products',
        loadChildren: './product-management/products.module#ProductsModule',
      },
      {
        path: 'categories',
        component: CategoryManagementComponent,
      },
      {
        path: 'addresses',
        component: AddressTableComponent,
      },
      {
        path: 'users',
        component: UserTableComponent,
      },
      {
        path: 'usergroups',
        loadChildren:
          './user-group-management/user-group.module#UserGroupModule',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
