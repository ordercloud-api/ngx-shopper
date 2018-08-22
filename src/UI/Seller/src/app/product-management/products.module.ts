import { NgModule } from '@angular/core';
import { SharedModule } from '@app-seller/shared';

import { ProductsRoutingModule } from '@app-seller/product-management/products-routing.module';
import { ProductTableComponent } from '@app-seller/product-management/containers/product-table/product-table.component';
import { ProductFormComponent } from '@app-seller/product-management/components/products-form/product-form.component';
import { ProductDetailsComponent } from '@app-seller/product-management/containers/product-details/product-details.component';
import { FormsModule } from '@angular/forms';
import { ProductImagesComponent } from '@app-seller/product-management/components/product-images/product-images.component';

@NgModule({
  imports: [SharedModule, ProductsRoutingModule, FormsModule],
  declarations: [
    ProductTableComponent,
    ProductFormComponent,
    ProductDetailsComponent,
    ProductImagesComponent,
  ],
})
export class ProductsModule {}
