// components
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HasTokenGuard as HasToken } from '@app-seller/shared';
import { HomeComponent } from '@app-seller/layout/home/home.component';
import { UserTableComponent } from '@app-seller/shared/containers/user-table/user-table.component';
import { AddressTableComponent } from '@app-seller/shared/containers/address-table/address-table.component';
import { CategoryDetailsComponent } from '@app-seller/shared/containers/category-details/category-details.component';
import { CategoryTableComponent } from '@app-seller/shared/containers/category-table/category-table.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [HasToken],
    children: [
      { path: '', redirectTo: '/home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      {
        path: 'products',
        loadChildren: () => import('./product-management/products.module').then(m => m.ProductsModule),
      },
      {
        path: 'categories',
        component: CategoryTableComponent,
      },
      {
        path: 'categories/:categoryID',
        component: CategoryDetailsComponent,
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
          () => import('./user-group-management/user-group.module').then(m => m.UserGroupModule),
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
