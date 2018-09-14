import { NgModule } from '@angular/core';
import { SharedModule } from '@app-buyer/shared';
import { TreeModule } from 'angular-tree-component';
import { ProductsRoutingModule } from '@app-buyer/product/product-routing.module';
import { ProductListComponent } from '@app-buyer/product/containers/product-list/product-list.component';
import { ProductDetailsComponent } from '@app-buyer/product/containers/product-details/product-details.component';
import { AdditionalImageGalleryComponent } from '@app-buyer/product/components/additional-image-gallery/additional-image-gallery.component';
import { ImageZoomModule } from 'angular2-image-zoom';
import { PriceFilterComponent } from '@app-buyer/product/components/price-filter/price-filter.component';
import { CategoryNavComponent } from '@app-buyer/product/components/category-nav/category-nav.component';
import { SortFilterComponent } from '@app-buyer/product/components/sort-filter/sort-filter.component';
import { FacetFilterComponent } from '@app-buyer/product/components/facet-filter/facet-filter.component';
import { FacetListComponent } from '@app-buyer/product/components/facet-list/facet-list.component';

@NgModule({
  imports: [SharedModule, ProductsRoutingModule, ImageZoomModule, TreeModule],
  declarations: [
    ProductListComponent,
    ProductDetailsComponent,
    AdditionalImageGalleryComponent,
    PriceFilterComponent,
    CategoryNavComponent,
    SortFilterComponent,
    FacetFilterComponent,
    FacetListComponent,
  ],
})
export class ProductsModule {}
