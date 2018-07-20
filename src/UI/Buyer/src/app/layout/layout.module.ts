import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HeaderComponent } from '@app/layout/header/header.component';
import { MainComponent } from '@app/layout/main/main.component';
import { FooterComponent } from '@app/layout/footer/footer.component';

import { SharedModule, NavBrandsPipe } from '@app/shared';
import { HomeComponent } from '@app/layout/home/home.component';

@NgModule({
  imports: [
    RouterModule,
    SharedModule
  ],
  exports: [
    HeaderComponent,
    MainComponent,
    FooterComponent,
    HomeComponent
  ],
  declarations: [
    HeaderComponent,
    MainComponent,
    FooterComponent,
    NavBrandsPipe,
    HomeComponent
  ]
})
export class LayoutModule { }
