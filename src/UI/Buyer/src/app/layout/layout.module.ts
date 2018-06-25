import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HeaderComponent } from './header/header.component';
import { MainComponent } from './main/main.component';
import { FooterComponent } from './footer/footer.component';

import { SharedModule, NavBrandsPipe } from '@app/shared';

@NgModule({
  imports: [
    RouterModule,
    SharedModule
  ],
  exports: [
    HeaderComponent,
    MainComponent,
    FooterComponent
  ],
  declarations: [
    HeaderComponent,
    MainComponent,
    FooterComponent,
    NavBrandsPipe
  ]
})
export class LayoutModule { }
