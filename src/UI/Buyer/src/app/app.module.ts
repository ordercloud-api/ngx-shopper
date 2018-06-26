// core services
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

// 3rd party
import { NgProgressModule } from '@ngx-progressbar/core';
import { NgProgressHttpModule } from '@ngx-progressbar/http';
import { CookieModule } from 'ngx-cookie';
import { ToastrModule } from 'ngx-toastr';

import { OrderCloudModule } from '@ordercloud/angular-sdk';
import { OcSDKConfig } from '../app/config/ordercloud-sdk.config';


// ngx-bootstrap
import { BsDropdownModule } from 'ngx-bootstrap';
// shared module
import { SharedModule } from '@app/shared';

// app modules
import { LayoutModule } from './layout/layout.module';
import { AuthModule } from './auth/auth.module';

// app components
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
// interceptors
import { AutoAppendTokenInterceptor, RefreshTokenInterceptor } from '@app/auth';

// date picker config
import { NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateNativeAdapter } from './config/date-picker.config';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    /**
     * app modules
     */
    AppRoutingModule,
    AuthModule,
    BrowserAnimationsModule,
    BrowserModule,
    LayoutModule,

    /**
     * third party modules
     * only those that must be installed
     * with forRoot should be defined here, all else
     * can live in shared
     */
    CookieModule.forRoot(),
    NgProgressModule.forRoot(),
    NgProgressHttpModule,
    OrderCloudModule.forRoot(OcSDKConfig),
    SharedModule.forRoot(),
    ToastrModule.forRoot(),

    /**
     * ngx-bootstrap modules
     * only those that are used by app
     * should be imported to reduce bundle size
     * keep commented out modules for reference
     */
    // AlertModule.forRoot(),
    // ModalModule.forRoot(),
    // AccordionModule.forRoot(),
    // BsDatepickerModule.forRoot(),
    BsDropdownModule.forRoot()
    // ButtonsModule.forRoot(),
    // CarouselModule.forRoot(),
    // CollapseModule.forRoot(),
    // DatepickerModule.forRoot(),
    // PaginationModule.forRoot(),
    // PopoverModule.forRoot(),
    // ProgressbarModule.forRoot(),
    // RatingModule.forRoot(),
    // SortableModule.forRoot(),
    // TabsModule.forRoot(),
    // TimepickerModule.forRoot(),
    // TooltipModule.forRoot(),
    // TypeaheadModule.forRoot(),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AutoAppendTokenInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RefreshTokenInterceptor,
      multi: true
    },
    { provide: NgbDateAdapter, useClass: NgbDateNativeAdapter }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
