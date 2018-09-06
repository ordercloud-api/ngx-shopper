import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from '@app-seller/app.component';
import { LayoutModule } from '@app-seller/layout/layout.module';
import {
  applicationConfiguration,
  ocAppConfig,
} from '@app-seller/config/app.config';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AutoAppendTokenInterceptor, AuthModule } from '@app-seller/auth';
import { RefreshTokenInterceptor } from '@app-seller/auth';
import { AppRoutingModule } from '@app-seller/app-routing.module';
import { OrderCloudModule } from '@ordercloud/angular-sdk';
import { OcSDKConfig } from '@app-seller/config/ordercloud-sdk.config';
import { CookieModule } from 'ngx-cookie';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SharedModule } from '@app-seller/shared';
import { NgProgressModule } from '@ngx-progressbar/core';
import { NgProgressHttpModule } from '@ngx-progressbar/http';
import { CacheInterceptor } from '@app-seller/auth/interceptors/cache/cache-interceptor';

@NgModule({
  declarations: [AppComponent],
  imports: [
    // This app
    AppRoutingModule,
    AuthModule,

    // Third party
    BrowserAnimationsModule,
    BrowserModule,
    LayoutModule,
    NgProgressModule.forRoot(),
    NgProgressHttpModule,
    OrderCloudModule.forRoot(OcSDKConfig),
    CookieModule.forRoot(),
    ToastrModule.forRoot(),
    SharedModule.forRoot(),
  ],
  providers: [
    {
      provide: applicationConfiguration,
      useValue: ocAppConfig,
    },
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
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
