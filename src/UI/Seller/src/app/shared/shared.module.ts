// angular
import { NgModule, ModuleWithProviders, ErrorHandler } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';

// 3rd party UI
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SharedRoutingModule } from '@app-seller/shared/shared-routing.module';
import { HasTokenGuard } from '@app-seller/shared/guards/has-token/has-token.guard';
import { AppErrorHandler } from '@app-seller/config/error-handling.config';
import { AppStateService } from '@app-seller/shared/services/app-state/app-state.service';
import { SearchComponent } from '@app-seller/shared/components/search/search.component';
import { SortColumnComponent } from '@app-seller/shared/components/sort-column/sort-column.component';

@NgModule({
  imports: [
    SharedRoutingModule,
    // angular
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,

    // 3rd party UI
    FontAwesomeModule,
    NgbPaginationModule.forRoot(),
  ],
  exports: [
    // angular
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,

    // 3rd party UI
    FontAwesomeModule,
    NgbPaginationModule,

    SearchComponent,
    SortColumnComponent,
  ],
  declarations: [SearchComponent, SortColumnComponent],

  /**
   * DO NOT define providers here
   * define providers in the static forRoot below to ensure
   * lazy-loaded modules define services as singletons
   * https://angular-2-training-book.rangle.io/handout/modules/shared-di-tree.html
   */
  providers: [
    HasTokenGuard,
    AppErrorHandler,
    AppStateService,
    { provide: ErrorHandler, useClass: AppErrorHandler },
  ],
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [],
    };
  }
}
