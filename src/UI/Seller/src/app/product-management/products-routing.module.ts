// core services
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProductDetailsComponent } from '@app-seller/product-management/containers/product-details/product-details.component';
import { ProductTableComponent } from '@app-seller/shared/containers/product-table/product-table.component';

const routes: Routes = [
  { path: '', component: ProductTableComponent },
  {
    path: ':productID',
    component: ProductDetailsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductsRoutingModule {}
