// core services
import { NgModule } from '@angular/core';
import { SharedModule } from '@app-buyer/shared';

// components
import { LoginComponent } from '@app-buyer/auth/containers/login/login.component';
import { RegisterComponent } from '@app-buyer/auth/containers/register/register.component';
import { ForgotPasswordComponent } from '@app-buyer/auth/containers/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from '@app-buyer/auth/containers/reset-password/reset-password.component';

// routing
import { AuthRoutingModule } from '@app-buyer/auth/auth-routing.module';

@NgModule({
  imports: [SharedModule, AuthRoutingModule],
  declarations: [
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
  ],
})
export class AuthModule {}
