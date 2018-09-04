import { NgModule } from '@angular/core';
import { SharedModule } from '@app-buyer/shared';
import { TreeModule } from 'angular-tree-component';

import { ProductsRoutingModule } from '@app-buyer/products/products-routing.module';
import { ProductListComponent } from '@app-buyer/products/containers/product-list/product-list.component';
import { ProductDetailsComponent } from '@app-buyer/products/containers/product-details/product-details.component';
import { AdditionalImageGalleryComponent } from '@app-buyer/products/components/additional-image-gallery/additional-image-gallery.component';
import { ImageZoomModule } from 'angular2-image-zoom';
import { PriceFilterComponent } from '@app-buyer/products/components/price-filter/price-filter.component';
import { CategoryNavComponent } from '@app-buyer/products/components/category-nav/category-nav.component';
import { SortFilterComponent } from './components/sort-filter/sort-filter.component';

@NgModule({
  imports: [SharedModule, ProductsRoutingModule, ImageZoomModule, TreeModule],
  declarations: [
    ProductListComponent,
    ProductDetailsComponent,
    AdditionalImageGalleryComponent,
    PriceFilterComponent,
    CategoryNavComponent,
    SortFilterComponent,
  ],
})
export class ProductsModule {}
