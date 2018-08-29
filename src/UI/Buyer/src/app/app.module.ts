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
import { OcSDKConfig } from '@app-buyer/config/ordercloud-sdk.config';

// shared module
import { SharedModule } from '@app-buyer/shared';

// app modules
import { LayoutModule } from '@app-buyer/layout/layout.module';
import { AuthModule } from '@app-buyer/auth/auth.module';

// app components
import { AppComponent } from '@app-buyer/app.component';
import { AppRoutingModule } from '@app-buyer/app-routing.module';

// static pages
import { SupportComponent } from './static-pages/support/support.component';
import { FaqComponent } from './static-pages/faq/faq.component';

// interceptors
import {
  AutoAppendTokenInterceptor,
  RefreshTokenInterceptor,
} from '@app-buyer/auth';

// date picker config
import { NgbDateAdapter } from '@ng-bootstrap/ng-bootstrap';
import { NgbDateNativeAdapter } from '@app-buyer/config/date-picker.config';
import { TermsAndConditionsComponent } from './static-pages/terms-and-conditions/terms-and-conditions.component';

@NgModule({
  declarations: [AppComponent, SupportComponent, FaqComponent, TermsAndConditionsComponent],
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
    { provide: NgbDateAdapter, useClass: NgbDateNativeAdapter },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
