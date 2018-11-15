// angular core
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { BrowserModule } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

// 3rd party
import { NgProgressModule } from '@ngx-progressbar/core';
import { NgProgressHttpModule } from '@ngx-progressbar/http';
import { CookieModule } from 'ngx-cookie';
import { ToastrModule } from 'ngx-toastr';
import { OrderCloudModule } from '@ordercloud/angular-sdk';
import { OcSDKConfig } from '@app-buyer/config/ordercloud-sdk.config';
import { NgxImageZoomModule } from 'ngx-image-zoom';

// app modules
import { SharedModule } from '@app-buyer/shared';
import { LayoutModule } from '@app-buyer/layout/layout.module';
import { AuthModule } from '@app-buyer/auth/auth.module';
import { AppRoutingModule } from '@app-buyer/app-routing.module';

// app component
import { AppComponent } from '@app-buyer/app.component';

// static pages
import { SupportComponent } from './static-pages/support/support.component';
import { FaqComponent } from './static-pages/faq/faq.component';

// interceptors
import {
  AutoAppendTokenInterceptor,
  RefreshTokenInterceptor,
  CacheInterceptor,
} from '@app-buyer/auth';

// date picker config
import { NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateNativeAdapter } from '@app-buyer/config/date-picker.config';
import { TermsAndConditionsComponent } from './static-pages/terms-and-conditions/terms-and-conditions.component';

// error handler config
import { AppErrorHandler } from './config/error-handling.config';

@NgModule({
  declarations: [
    AppComponent,
    SupportComponent,
    FaqComponent,
    TermsAndConditionsComponent,
  ],
  imports: [
    // angular core modules
    BrowserAnimationsModule,
    BrowserModule,

    // app modules
    AppRoutingModule,
    AuthModule,
    LayoutModule,

    /**
     * third party modules
     * only those that must be installed
     * with forRoot (except shared) should be defined here, all else
     * can live in shared
     */
    SharedModule,
    CookieModule.forRoot(),
    NgProgressModule.forRoot(),
    NgProgressHttpModule,
    OrderCloudModule.forRoot(OcSDKConfig),
    ToastrModule.forRoot(),
    NgxImageZoomModule.forRoot(),
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AutoAppendTokenInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: RefreshTokenInterceptor,
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CacheInterceptor,
      multi: true,
    },
    { provide: NgbDateAdapter, useClass: NgbDateNativeAdapter },
    { provide: ErrorHandler, useClass: AppErrorHandler },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
