import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';


// import { AppComponent } from './app.component';
import { AppComponent } from '@app-seller/app.component';
import { LayoutModule } from '@app-buyer/layout/layout.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    LayoutModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
