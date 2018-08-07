import { NgModule } from '@angular/core';
import { SharedModule } from '@app-seller/shared';

import { ProductTableComponent } from '@app-seller/product-management/product-table/product-table.component';
import { ProductsRoutingModule } from '@app-seller/product-management/products-routing.module';

@NgModule({
  imports: [SharedModule, ProductsRoutingModule],
  declarations: [ProductTableComponent],
})
export class ProductsModule {}
