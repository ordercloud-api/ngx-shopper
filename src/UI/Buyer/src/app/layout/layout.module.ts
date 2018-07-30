import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HeaderComponent } from '@app-buyer/layout/header/header.component';
import { MainComponent } from '@app-buyer/layout/main/main.component';
import { FooterComponent } from '@app-buyer/layout/footer/footer.component';

import { SharedModule } from '@app-buyer/shared';
import { HomeComponent } from '@app-buyer/layout/home/home.component';

@NgModule({
  imports: [RouterModule, SharedModule],
  exports: [HeaderComponent, MainComponent, FooterComponent, HomeComponent],
  declarations: [
    HeaderComponent,
    MainComponent,
    FooterComponent,
    HomeComponent,
  ],
})
export class LayoutModule {}
