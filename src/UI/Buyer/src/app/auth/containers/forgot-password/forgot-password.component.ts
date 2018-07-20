// angular
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

// angular libs
import { ToastrService } from 'ngx-toastr';

// ordercloud
import { PasswordResetService } from '@ordercloud/angular-sdk';
import { applicationConfiguration, AppConfig } from '@app/config/app.config';

@Component({
  selector: 'auth-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

  resetEmailForm: FormGroup;

  constructor(
    private passwordResetService: PasswordResetService,
    private router: Router,
    private formBuilder: FormBuilder,
    private toasterService: ToastrService,
    @Inject(applicationConfiguration) private appConfig: AppConfig) {
  }

  ngOnInit() {
    this.resetEmailForm = this.formBuilder.group({ email: '' });
  }

  onSubmit() {
    this.passwordResetService.SendVerificationCode({
      Email: this.resetEmailForm.get('email').value,
      ClientID: this.appConfig.clientID,
      URL: window.location.origin
    }).subscribe(
      () => {
        this.toasterService.success('Password Reset Email Sent!');
        this.router.navigateByUrl('/login');
      }, error => {
        throw error;
      });
  }
}
