import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared';
import { TreeModule } from 'angular-tree-component';

import { ProductsRoutingModule } from './products-routing.module';
import { ProductListComponent } from './containers/product-list/product-list.component';
import { ProductDetailsComponent } from './containers/product-details/product-details.component';
import { AdditionalImageGalleryComponent } from './components/additional-image-gallery/additional-image-gallery.component';
import { ImageZoomModule } from 'angular2-image-zoom';
import { PriceFilterComponent } from './components/price-filter/price-filter.component';
import { CategoryNavComponent } from './components/category-nav/category-nav.component';

@NgModule({
  imports: [
    SharedModule,
    ProductsRoutingModule,
    ImageZoomModule,
    TreeModule
  ],
  declarations: [
    ProductListComponent,
    ProductDetailsComponent,
    AdditionalImageGalleryComponent,
    PriceFilterComponent,
    CategoryNavComponent
  ]
})
export class ProductsModule { }
