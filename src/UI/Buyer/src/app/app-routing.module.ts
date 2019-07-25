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
        loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule),
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
        loadChildren: () => import('./product/product.module').then(m => m.ProductsModule),
      },
      { path: '', loadChildren: () => import('./checkout/checkout.module').then(m => m.CheckoutModule) },
      { path: 'impersonation', redirectTo: '/home' },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
