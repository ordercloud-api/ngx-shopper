import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from '@app-seller/layout/header/header.component';
import { HomeComponent } from '@app-seller/layout/home/home.component';

@NgModule({
  imports: [
    CommonModule
  ],
  exports: [
    HeaderComponent,
    HomeComponent
  ],
  declarations: [
    HeaderComponent,
    HomeComponent
  ]
})
export class LayoutModule { }
