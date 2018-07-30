// core services
import { NgModule } from '@angular/core';
import { SharedModule } from '@app-buyer/shared';

// components
import { LoginComponent } from '@app-buyer/auth/containers/login/login.component';
import { ForgotPasswordComponent } from '@app-buyer/auth/containers/forgot-password/forgot-password.component';
import { ResetPasswordComponent } from '@app-buyer/auth/containers/reset-password/reset-password.component';

// routing
import { AuthRoutingModule } from '@app-buyer/auth/auth-routing.module';
import { AppAuthService } from '@app-buyer/auth/services/app-auth.service';

@NgModule({
  imports: [SharedModule, AuthRoutingModule],
  declarations: [
    LoginComponent,
    ForgotPasswordComponent,
    ResetPasswordComponent,
  ],
  providers: [AppAuthService],
})
export class AuthModule {}
