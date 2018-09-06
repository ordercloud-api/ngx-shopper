// core services
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// product components
import { ProductListComponent } from '@app-buyer/product/containers/product-list/product-list.component';
import { ProductDetailsComponent } from '@app-buyer/product/containers/product-details/product-details.component';

const routes: Routes = [
  { path: '', component: ProductListComponent },
  { path: ':productID', component: ProductDetailsComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProductsRoutingModule {}
