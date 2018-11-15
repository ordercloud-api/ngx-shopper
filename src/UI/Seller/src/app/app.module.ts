// angular core
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// 3rd party
import { OrderCloudModule } from '@ordercloud/angular-sdk';
import { OcSDKConfig } from '@app-seller/config/ordercloud-sdk.config';
import { CookieModule } from 'ngx-cookie';
import { ToastrModule } from 'ngx-toastr';
import { NgProgressModule } from '@ngx-progressbar/core';
import { NgProgressHttpModule } from '@ngx-progressbar/http';

// app modules
import { SharedModule } from '@app-seller/shared';
import { AppRoutingModule } from '@app-seller/app-routing.module';
import { LayoutModule } from '@app-seller/layout/layout.module';
import { AuthModule } from '@app-seller/auth';

//app component
import { AppComponent } from '@app-seller/app.component';

// interceptors
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AutoAppendTokenInterceptor } from '@app-seller/auth';
import { RefreshTokenInterceptor } from '@app-seller/auth';
import { CacheInterceptor } from '@app-seller/auth/interceptors/cache/cache-interceptor';

// error handler config
import { AppErrorHandler } from './config/error-handling.config';

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
    SharedModule,
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
    { provide: ErrorHandler, useClass: AppErrorHandler },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
