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
import { AppErrorHandler } from '../config/error-handling.config';
import { AppStateService } from './services/app-state/app-state.service';
import { applicationConfiguration, ocAppConfig } from '../config/app.config';
import { BaseResolve } from '../shared/resolves/base.resolve';
import { SharedRoutingModule } from './shared-routing.module';
import { BaseResolveService } from './services/base-resolve/base-resolve.service';
import { OcLineItemService } from './services/oc-line-item/oc-line-item.service';
import { AuthorizeNetService } from './services/authorize-net/authorize-net.service';
import { OcFormErrorService } from './services/oc-form-error/oc-form-error.service';

// pipes
import { NavBrandsPipe } from './pipes/navigation/nav-brands.pipe';
import { PhoneFormatPipe } from './pipes/phone-format/phone-format.pipe';
import { OrderStatusDisplayPipe } from './pipes/order-status-display/order-status-display.pipe';
import { PaymentMethodDisplayPipe } from '@app/shared/pipes/payment-method-display/payment-method-display.pipe';

// directives
import { PhoneInputDirective } from './directives/phone-input/phone-input.directive';

// guards
import { HasTokenGuard } from './guards/has-token/has-token.guard';
import { IsLoggedInGuard } from './guards/is-logged-in/is-logged-in.guard';

import { NgbDateCustomParserFormatter } from '@app/config/date-picker.config';

// components
import { AddressFormComponent } from './components/address-form/address-form.component';
import { CreditCardFormComponent } from '@app/shared/components/credit-card-form/credit-card-form.component';
import { CreditCardIconComponent } from './components/credit-card-icon/credit-card-icon.component';
import { SearchComponent } from './components/search/search.component';
import { PageTitleComponent } from './components/page-title/page-title.component';
import { AddressDisplayComponent } from './components/address-display/address-display.component';
import { CreditCardDisplayComponent } from './components/credit-card-display/credit-card-display.component';
import { LineItemCardComponent } from '@app/shared/components/line-item-card/line-item-card.component';
import { LineItemListWrapperComponent } from './components/lineitem-list-wrapper/lineitem-list-wrapper.component';

// containers
import { RegisterComponent } from '../shared/containers/register/register.component';
import { ShipperTrackingPipe, ShipperTrackingSupportedPipe } from '@app/shared/pipes/shipperTracking/shipperTracking.pipe';
import { QuantityInputComponent } from './components/quantity-input/quantity-input.component';
import { ToggleFavoriteComponent } from './components/toggle-favorite/toggle-favorite.component';
import { ProductCardComponent } from './components/product-card/product-card.component';
import { ProductCarouselComponent } from './components/product-carousel/product-carousel.component';
import { TemplateDropdownComponent } from './components/template-dropdown/template-dropdown.component';
import { MapToIterablePipe } from '@app/shared/pipes/map-to-iterable/map-to-iterable.pipe';

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
    TemplateDropdownComponent
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
    TemplateDropdownComponent
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
