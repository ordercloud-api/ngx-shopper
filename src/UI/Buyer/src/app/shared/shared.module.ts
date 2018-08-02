// angular
import { NgModule, ErrorHandler, ModuleWithProviders } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

// 3rd party UI
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { TextMaskModule } from 'angular2-text-mask';

// ng-bootstrap modules
import {
  NgbCollapseModule,
  NgbDatepickerModule,
  NgbTabsetModule,
  NgbPaginationModule,
  NgbPopoverModule,
  NgbAccordionModule,
  NgbModalModule,
  NgbCarouselModule,
} from '@ng-bootstrap/ng-bootstrap';

// app services
import { AppErrorHandler } from '@app-buyer/config/error-handling.config';
import { AppStateService } from '@app-buyer/shared/services/app-state/app-state.service';
import {
  applicationConfiguration,
  ocAppConfig,
} from '@app-buyer/config/app.config';
import { BaseResolve } from '@app-buyer/shared/resolves/base.resolve';
import { SharedRoutingModule } from '@app-buyer/shared/shared-routing.module';
import { BaseResolveService } from '@app-buyer/shared/services/base-resolve/base-resolve.service';
import { AppLineItemService } from '@app-buyer/shared/services/line-item/line-item.service';
import { AuthorizeNetService } from '@app-buyer/shared/services/authorize-net/authorize-net.service';
import { AppFormErrorService } from '@app-buyer/shared/services/form-error/form-error.service';
import { ModalService } from '@app-buyer/shared/services/modal/modal.service';

// pipes
import { PhoneFormatPipe } from '@app-buyer/shared/pipes/phone-format/phone-format.pipe';
import { OrderStatusDisplayPipe } from '@app-buyer/shared/pipes/order-status-display/order-status-display.pipe';
import { PaymentMethodDisplayPipe } from '@app-buyer/shared/pipes/payment-method-display/payment-method-display.pipe';

// directives
import { PhoneInputDirective } from '@app-buyer/shared/directives/phone-input/phone-input.directive';

// guards
import { HasTokenGuard } from '@app-buyer/shared/guards/has-token/has-token.guard';
import { IsLoggedInGuard } from '@app-buyer/shared/guards/is-logged-in/is-logged-in.guard';

import { NgbDateCustomParserFormatter } from '@app-buyer/config/date-picker.config';

// components
import { AddressFormComponent } from '@app-buyer/shared/components/address-form/address-form.component';
import { CreditCardFormComponent } from '@app-buyer/shared/components/credit-card-form/credit-card-form.component';
import { CreditCardIconComponent } from '@app-buyer/shared/components/credit-card-icon/credit-card-icon.component';
import { SearchComponent } from '@app-buyer/shared/components/search/search.component';
import { PageTitleComponent } from '@app-buyer/shared/components/page-title/page-title.component';
import { AddressDisplayComponent } from '@app-buyer/shared/components/address-display/address-display.component';
import { CreditCardDisplayComponent } from '@app-buyer/shared/components/credit-card-display/credit-card-display.component';
import { LineItemCardComponent } from '@app-buyer/shared/components/line-item-card/line-item-card.component';
import { LineItemListWrapperComponent } from '@app-buyer/shared/components/lineitem-list-wrapper/lineitem-list-wrapper.component';

// containers
import { RegisterComponent } from '@app-buyer/shared/containers/register/register.component';
import {
  ShipperTrackingPipe,
  ShipperTrackingSupportedPipe,
} from '@app-buyer/shared/pipes/shipperTracking/shipperTracking.pipe';
import { QuantityInputComponent } from '@app-buyer/shared/components/quantity-input/quantity-input.component';
import { ToggleFavoriteComponent } from '@app-buyer/shared/components/toggle-favorite/toggle-favorite.component';
import { ProductCardComponent } from '@app-buyer/shared/components/product-card/product-card.component';
import { ProductCarouselComponent } from '@app-buyer/shared/components/product-carousel/product-carousel.component';
import { MapToIterablePipe } from '@app-buyer/shared/pipes/map-to-iterable/map-to-iterable.pipe';
import { GenericBrowseComponent } from '@app-buyer/shared/components/generic-browse/generic-browse.component';
import { ModalComponent } from '@app-buyer/shared/components/modal/modal.component';
import { OrderPaymentListComponent } from '@app-buyer/shared/components/payment-list/order-payment-list.component';

@NgModule({
  imports: [
    SharedRoutingModule,
    // angular
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,

    // 3rd party UI
    FontAwesomeModule,
    TextMaskModule,

    /**
     * ng-bootstrap modules
     * only those that are used by app
     * should be imported to reduce bundle size
     */
    NgbDatepickerModule.forRoot(),
    NgbCollapseModule.forRoot(),
    NgbModalModule.forRoot(),
    NgbTabsetModule.forRoot(),
    NgbPaginationModule.forRoot(),
    NgbPopoverModule.forRoot(),
    NgbAccordionModule.forRoot(),
    NgbCarouselModule.forRoot(),
  ],
  exports: [
    // angular
    CommonModule,
    HttpClientModule,
    ReactiveFormsModule,

    // 3rd party UI
    FontAwesomeModule,
    TextMaskModule,

    NgbDatepickerModule,
    NgbCollapseModule,
    NgbModalModule,
    NgbTabsetModule,
    NgbPaginationModule,
    NgbPopoverModule,
    NgbAccordionModule,
    NgbCarouselModule,

    SearchComponent,
    RegisterComponent,
    PageTitleComponent,
    PhoneFormatPipe,
    OrderStatusDisplayPipe,
    PaymentMethodDisplayPipe,
    MapToIterablePipe,
    CreditCardIconComponent,
    AddressDisplayComponent,
    CreditCardDisplayComponent,
    CreditCardFormComponent,
    LineItemListWrapperComponent,
    PhoneInputDirective,
    LineItemCardComponent,
    ShipperTrackingPipe,
    ShipperTrackingSupportedPipe,
    AddressFormComponent,
    QuantityInputComponent,
    ToggleFavoriteComponent,
    ProductCardComponent,
    ProductCarouselComponent,
    GenericBrowseComponent,
    ModalComponent,
    OrderPaymentListComponent,
  ],
  declarations: [
    RegisterComponent,
    PhoneFormatPipe,
    OrderStatusDisplayPipe,
    PaymentMethodDisplayPipe,
    MapToIterablePipe,
    PageTitleComponent,
    AddressDisplayComponent,
    CreditCardDisplayComponent,
    CreditCardFormComponent,
    PhoneInputDirective,
    SearchComponent,
    CreditCardIconComponent,
    LineItemCardComponent,
    ShipperTrackingPipe,
    ShipperTrackingSupportedPipe,
    AddressFormComponent,
    LineItemListWrapperComponent,
    QuantityInputComponent,
    ToggleFavoriteComponent,
    ProductCardComponent,
    ProductCarouselComponent,
    GenericBrowseComponent,
    ModalComponent,
    OrderPaymentListComponent,
  ],

  /**
   * DO NOT define providers here
   * define providers in the static forRoot below to ensure
   * lazy-loaded modules define services as singletons
   * https://angular-2-training-book.rangle.io/handout/modules/shared-di-tree.html
   */
  providers: [],
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule,
      providers: [
        AppStateService,
        AuthorizeNetService,
        BaseResolve,
        BaseResolveService,
        AppFormErrorService,
        AppLineItemService,
        ModalService,
        PhoneFormatPipe,
        OrderStatusDisplayPipe,
        PaymentMethodDisplayPipe,
        MapToIterablePipe,
        AppErrorHandler,
        HasTokenGuard,
        IsLoggedInGuard,
        DatePipe,
        NgbDateCustomParserFormatter,
        { provide: applicationConfiguration, useValue: ocAppConfig },
        { provide: ErrorHandler, useClass: AppErrorHandler },
      ],
    };
  }
}
