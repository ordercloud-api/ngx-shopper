// angular
import { NgModule, ModuleWithProviders, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import {
  NgbPaginationModule,
  NgbTabsetModule,
} from '@ng-bootstrap/ng-bootstrap';

// 3rd party UI
import { TreeModule } from 'angular-tree-component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { SharedRoutingModule } from '@app-seller/shared/shared-routing.module';
import { HasTokenGuard } from '@app-seller/shared/guards/has-token/has-token.guard';
import { AppErrorHandler } from '@app-seller/config/error-handling.config';
import { AppStateService } from '@app-seller/shared/services/app-state/app-state.service';
import { SearchComponent } from '@app-seller/shared/components/search/search.component';
import { SortColumnComponent } from '@app-seller/shared/components/sort-column/sort-column.component';
import { ModalService } from '@app-seller/shared/services/modal/modal.service';
import { ModalComponent } from '@app-seller/shared/components/modal/modal.component';
import { AppFormErrorService } from '@app-seller/shared/services/form-error/form-error.service';
import { CarouselSlideDisplayComponent } from '@app-seller/shared/components/carousel-slide-display/carousel-slide-display.component';
import { GenericBrowseComponent } from '@app-seller/shared/components/generic-browse/generic-browse.component';
import { UserTableComponent } from '@app-seller/shared/containers/user-table/user-table.component';
import { UserFormComponent } from '@app-seller/shared/components/user-form/user-form.component';
import { AddressTableComponent } from './containers/address-table/address-table.component';
import { AppGeographyService } from '@app-seller/shared/services/geography/geography.service';
import { AddressFormComponent } from '@app-seller/shared/components/address-form/address-form.component';
import { CategoryManagementComponent } from './containers/category-management/category-management.component';
import { CategoryFormComponent } from './components/category-form/category-form.component';
import { CategoryDetailsComponent } from './containers/category-details/category-details.component';
import { ProductTableComponent } from '@app-seller/shared/containers/product-table/product-table.component';
import { ProductFormComponent } from '@app-seller/shared/components/products-form/product-form.component';

@NgModule({
  imports: [
    SharedRoutingModule,
    // angular
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,

    // 3rd party UI
    TreeModule,
    FontAwesomeModule,
    FormsModule,
    NgbPaginationModule.forRoot(),
    NgbTabsetModule.forRoot(),
  ],
  exports: [
    // angular
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,

    // 3rd party UI
    TreeModule,
    FontAwesomeModule,
    NgbPaginationModule,
    NgbTabsetModule,

    // app components
    SearchComponent,
    SortColumnComponent,
    ModalComponent,
    CarouselSlideDisplayComponent,
    GenericBrowseComponent,
    UserTableComponent,
    UserFormComponent,
    AddressTableComponent,
    AddressFormComponent,
    CategoryManagementComponent,
    CategoryFormComponent,
    CategoryDetailsComponent,
    ProductTableComponent,
    ProductFormComponent,
  ],
  declarations: [
    SearchComponent,
    SortColumnComponent,
    ModalComponent,
    CarouselSlideDisplayComponent,
    GenericBrowseComponent,
    UserTableComponent,
    UserFormComponent,
    AddressTableComponent,
    AddressFormComponent,
    CategoryManagementComponent,
    CategoryFormComponent,
    CategoryDetailsComponent,
    ProductTableComponent,
    ProductFormComponent,
  ],

  /**
   * DO NOT define providers here
   * define providers in the static forRoot below to ensure
   * lazy-loaded modules define services as singletons
   * https://angular-2-training-book.rangle.io/handout/modules/shared-di-tree.html
   */
  providers: [
    HasTokenGuard,
    AppStateService,
    ModalService,
    AppFormErrorService,
    AppGeographyService,
  ],
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
        AppErrorHandler,
        { provide: ErrorHandler, useClass: AppErrorHandler },
      ],
    };
  }
}
