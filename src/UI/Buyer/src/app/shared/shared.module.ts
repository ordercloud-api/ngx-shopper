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
import { AppErrorHandler } from '@app/config/error-handling.config';
import { AppStateService } from '@app/shared/services/app-state/app-state.service';
import { applicationConfiguration, ocAppConfig } from '@app/config/app.config';
import { BaseResolve } from '@app/shared/resolves/base.resolve';
import { SharedRoutingModule } from '@app/shared/shared-routing.module';
import { BaseResolveService } from '@app/shared/services/base-resolve/base-resolve.service';
import { OcLineItemService } from '@app/shared/services/oc-line-item/oc-line-item.service';
import { AuthorizeNetService } from '@app/shared/services/authorize-net/authorize-net.service';
import { OcFormErrorService } from '@app/shared/services/oc-form-error/oc-form-error.service';
import { ModalService } from '@app/shared/services/modal/modal.service';

// pipes
import { NavBrandsPipe } from '@app/shared/pipes/navigation/nav-brands.pipe';
import { PhoneFormatPipe } from '@app/shared/pipes/phone-format/phone-format.pipe';
import { OrderStatusDisplayPipe } from '@app/shared/pipes/order-status-display/order-status-display.pipe';
import { PaymentMethodDisplayPipe } from '@app/shared/pipes/payment-method-display/payment-method-display.pipe';

// directives
import { PhoneInputDirective } from '@app/shared/directives/phone-input/phone-input.directive';

// guards
import { HasTokenGuard } from '@app/shared/guards/has-token/has-token.guard';
import { IsLoggedInGuard } from '@app/shared/guards/is-logged-in/is-logged-in.guard';

import { NgbDateCustomParserFormatter } from '@app/config/date-picker.config';

// components
import { AddressFormComponent } from '@app/shared/components/address-form/address-form.component';
import { CreditCardFormComponent } from '@app/shared/components/credit-card-form/credit-card-form.component';
import { CreditCardIconComponent } from '@app/shared/components/credit-card-icon/credit-card-icon.component';
import { SearchComponent } from '@app/shared/components/search/search.component';
import { PageTitleComponent } from '@app/shared/components/page-title/page-title.component';
import { AddressDisplayComponent } from '@app/shared/components/address-display/address-display.component';
import { CreditCardDisplayComponent } from '@app/shared/components/credit-card-display/credit-card-display.component';
import { LineItemCardComponent } from '@app/shared/components/line-item-card/line-item-card.component';
import { LineItemListWrapperComponent } from '@app/shared/components/lineitem-list-wrapper/lineitem-list-wrapper.component';

// containers
import { RegisterComponent } from '@app/shared/containers/register/register.component';
import { ShipperTrackingPipe, ShipperTrackingSupportedPipe } from '@app/shared/pipes/shipperTracking/shipperTracking.pipe';
import { QuantityInputComponent } from '@app/shared/components/quantity-input/quantity-input.component';
import { ToggleFavoriteComponent } from '@app/shared/components/toggle-favorite/toggle-favorite.component';
import { ProductCardComponent } from '@app/shared/components/product-card/product-card.component';
import { ProductCarouselComponent } from '@app/shared/components/product-carousel/product-carousel.component';
import { MapToIterablePipe } from '@app/shared/pipes/map-to-iterable/map-to-iterable.pipe';
import { GenericBrowseComponent } from '@app/shared/components/generic-browse/generic-browse.component';
import { ModalComponent } from '@app/shared/components/modal/modal.component';
import { OrderPaymentListComponent } from '@app/shared/components/payment-list/order-payment-list.component';


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
    NgbCarouselModule.forRoot()
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
    OrderPaymentListComponent
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
    OrderPaymentListComponent
  ],

  /**
   * DO NOT define providers here
   * define providers in the static forRoot below to ensure
   * lazy-loaded modules define services as singletons
   * https://angular-2-training-book.rangle.io/handout/modules/shared-di-tree.html
   */
  providers: [NavBrandsPipe],

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
        OcFormErrorService,
        OcLineItemService,
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
        { provide: ErrorHandler, useClass: AppErrorHandler }
      ]
    };
  }
}
