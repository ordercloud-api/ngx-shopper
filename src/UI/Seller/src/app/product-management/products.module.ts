import { NgModule } from '@angular/core';
import { SharedModule } from '@app-seller/shared';

import { ProductsRoutingModule } from '@app-seller/product-management/products-routing.module';
import { ProductTableComponent } from '@app-seller/product-management/containers/product-table/product-table.component';
import { ProductsFormComponent } from '@app-seller/product-management/components/products-form/products-form.component';
import { ProductDetailsComponent } from '@app-seller/product-management/containers/product-details/product-details.component';
import { ProductDetailsImagesComponent } from '@app-seller/product-management/components/product-details-images/product-details-images.component';
import { FormsModule } from '@angular/forms';
import { ProductImageCardComponent } from './components/product-image-card/product-image-card.component';

@NgModule({
  imports: [SharedModule, ProductsRoutingModule, FormsModule],
  declarations: [
    ProductTableComponent,
    ProductsFormComponent,
    ProductDetailsComponent,
    ProductDetailsImagesComponent,
    ProductImageCardComponent,
  ],
})
export class ProductsModule {}
