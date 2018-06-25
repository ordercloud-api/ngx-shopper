// core services
import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared';

// components
import { LoginComponent } from './containers/login/login.component';
import { ForgotPasswordComponent } from './containers/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from './containers/reset-password/reset-password.component';

// routing
import { AuthRoutingModule } from './auth-routing.module';
import { AppAuthService } from '@app/auth/services/auth.service';


@NgModule({
  imports: [
    SharedModule,
    AuthRoutingModule,
  ],
  declarations: [
    LoginComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent
  ],
  providers: [
    AppAuthService,
  ]
})
export class AuthModule { }
