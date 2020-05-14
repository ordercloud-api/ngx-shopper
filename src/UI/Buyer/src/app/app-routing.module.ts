// components
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FaqComponent } from './static-pages/faq/faq.component';
import { SupportComponent } from './static-pages/support/support.component';

import {
  BaseResolve,
  IsProfiledUserGuard as isProfiledUser,
  HasTokenGuard as HasToken,
} from '@app-buyer/shared';
import { HomeComponent } from '@app-buyer/layout/home/home.component';
import { TermsAndConditionsComponent } from '@app-buyer/static-pages/terms-and-conditions/terms-and-conditions.component';
import { ProductsModule } from './product/product.module';
import { ProfileModule } from './profile/profile.module';
import { CheckoutModule } from './checkout/checkout.module';

export function loadProductsModule() {
  return ProductsModule;
}

export function loadProfileModule() {
  return ProfileModule;
}

export function loadCheckoutModule() {
  return CheckoutModule;
}

const routes: Routes = [
  {
    path: '',
    canActivate: [HasToken],
    resolve: {
      baseResolve: BaseResolve,
    },
    children: [
      { path: '', redirectTo: '/home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      {
        path: 'profile',
        loadChildren: './profile/profile.module#ProfileModule',
        canActivate: [isProfiledUser],
      },
      {
        path: 'support',
        component: SupportComponent,
      },
      {
        path: 'faq',
        component: FaqComponent,
      },
      {
        path: 'terms-and-conditions',
        component: TermsAndConditionsComponent,
      },
      {
        path: 'products',
        loadChildren: './product/product.module#ProductsModule',
      },
      { path: '', loadChildren: './checkout/checkout.module#CheckoutModule' },
      { path: 'impersonation', redirectTo: '/home' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
