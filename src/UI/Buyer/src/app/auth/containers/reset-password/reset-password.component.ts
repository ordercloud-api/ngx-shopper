// angular
import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

// angular libs
import { ToastrService } from 'ngx-toastr';

// ordercloud
import { OcMatchFieldsValidator, OcFormErrorService } from '@app/shared';
import { applicationConfiguration, AppConfig } from '@app/config/app.config';
import { PasswordResetService, PasswordReset } from '@ordercloud/angular-sdk';


@Component({
  selector: 'auth-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  resetPasswordForm: FormGroup;
  username: string;
  resetCode: string;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private toasterService: ToastrService,
    private formBuilder: FormBuilder,
    private passwordResetService: PasswordResetService,
    private formErrorService: OcFormErrorService,
    @Inject(applicationConfiguration) private appConfig: AppConfig) { }

  ngOnInit() {
    const urlParams = this.activatedRoute.snapshot.queryParams;
    this.username = urlParams['user'];
    this.resetCode = urlParams['code'];

    this.resetPasswordForm = this.formBuilder.group({
      password: '',
      passwordConfirm: ''
    }, { validator: OcMatchFieldsValidator('password', 'passwordConfirm') });
  }

  onSubmit() {
    if (this.resetPasswordForm.status === 'INVALID') {
      return;
    }

    const config: PasswordReset = {
      ClientID: this.appConfig.clientID,
      Password: this.resetPasswordForm.get('password').value,
      Username: this.username
    };

    this.passwordResetService.ResetPasswordByVerificationCode(this.resetCode, config).subscribe(
      () => {
        this.toasterService.success('Password Reset Successfully');
        this.router.navigateByUrl('/login');
      }, error => {
        throw error;
      });
  }

  // control visibility of password mismatch error
  protected passwordMismatchError = (): boolean => this.formErrorService.hasPasswordMismatchError(this.resetPasswordForm);

}

