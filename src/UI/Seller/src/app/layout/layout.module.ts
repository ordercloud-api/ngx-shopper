import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { HomeComponent } from './home/home.component';

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
