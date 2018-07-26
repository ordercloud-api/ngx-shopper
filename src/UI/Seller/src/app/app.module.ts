import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from '@app-seller/app.component';
import { LayoutModule } from '@app-seller/layout/layout.module';
import { applicationConfiguration, ocAppConfig } from '@app-seller/config/app.config';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    LayoutModule
  ],
  providers: [
    { provide: applicationConfiguration, useValue: ocAppConfig }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
