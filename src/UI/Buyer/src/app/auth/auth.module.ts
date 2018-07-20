// core services
import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared';

// components
import { LoginComponent } from '@app/auth/containers/login/login.component';
import { ForgotPasswordComponent } from '@app/auth/containers/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from '@app/auth/containers/reset-password/reset-password.component';

// routing
import { AuthRoutingModule } from '@app/auth/auth-routing.module';
import { AppAuthService } from '@app/auth/services/app-auth.service';


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
