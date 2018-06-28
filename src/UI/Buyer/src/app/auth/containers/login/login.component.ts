// angular
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

// ordercloud
import { AuthService, TokenService } from '@ordercloud/angular-sdk';
import { applicationConfiguration, AppConfig } from '../../../config/app.config';
import { AppAuthService } from '../../services/auth.service';

@Component({
  selector: 'auth-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  form: FormGroup;

  constructor(
    private ocAuthService: AuthService,
    private appAuthService: AppAuthService,
    private ocTokenService: TokenService,
    private router: Router,
    private fb: FormBuilder,
    @Inject(applicationConfiguration) private appConfig: AppConfig) { }

  ngOnInit() {
    this.form = this.fb.group({
      username: '',
      password: '',
      rememberMe: false
    });
  }

  onSubmit() {
    return this.ocAuthService.Login(
      this.form.get('username').value,
      this.form.get('password').value,
      this.appConfig.clientID,
      this.appConfig.scope
    )
      .subscribe(response => {
        const rememberMe = this.form.get('rememberMe').value;
        if (rememberMe && response.refresh_token) {
          /**
           * set the token duration in the dashboard - https://developer.ordercloud.io/dashboard/settings
           * refresh tokens are configured per clientID and initially set to 0
           * a refresh token of 0 means no refresh token is returned in OAuth response
           */
          this.ocTokenService.SetRefresh(response.refresh_token);
          this.appAuthService.setRememberStatus(true);
        }
        this.ocTokenService.SetAccess(response.access_token);
        this.router.navigateByUrl('/home');
      });
  }
}
