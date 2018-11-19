import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OcMeService, OcTokenService, MeUser } from '@ordercloud/angular-sdk';
import {
  applicationConfiguration,
  AppConfig,
} from '@app-buyer/config/app.config';
import { AppFormErrorService } from '@app-buyer/shared/services/form-error/form-error.service';
import { AppMatchFieldsValidator } from '@app-buyer/shared/validators/match-fields/match-fields.validator';
import { RegexService } from '@app-buyer/shared/services/regex/regex.service';

@Component({
  selector: 'auth-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  form: FormGroup;
  me: MeUser;
  alive = true;

  constructor(
    private formBuilder: FormBuilder,
    private formErrorService: AppFormErrorService,
    private ocMeService: OcMeService,
    private ocTokenService: OcTokenService,
    private router: Router,
    private toastrService: ToastrService,
    private regexService: RegexService,
    @Inject(applicationConfiguration) protected appConfig: AppConfig
  ) {}

  ngOnInit() {
    this.setForm();
  }

  private setForm() {
    this.form = this.formBuilder.group(
      {
        Username: ['', Validators.required],
        FirstName: [
          '',
          [
            Validators.required,
            Validators.pattern(this.regexService.HumanName),
          ],
        ],
        LastName: [
          '',
          [
            Validators.required,
            Validators.pattern(this.regexService.HumanName),
          ],
        ],
        Email: ['', [Validators.required, Validators.email]],
        Phone: ['', Validators.pattern(this.regexService.Phone)],
        Password: ['', [Validators.required, Validators.minLength(8)]],
        ConfirmPassword: ['', [Validators.required, Validators.minLength(8)]],
      },
      {
        validator: AppMatchFieldsValidator('Password', 'ConfirmPassword'),
      }
    );
  }

  onSubmit() {
    if (this.form.status === 'INVALID') {
      return this.formErrorService.displayFormErrors(this.form);
    }

    const me = <MeUser>this.form.value;
    me.Active = true;

    this.ocMeService
      .Register(this.ocTokenService.GetAccess(), me)
      .subscribe(() => {
        this.toastrService.success('New User Created');
        this.router.navigate(['/login']);
      });
  }

  ngOnDestroy() {
    this.alive = false;
  }

  // control display of error messages
  protected hasRequiredError = (controlName: string): boolean =>
    this.formErrorService.hasRequiredError(controlName, this.form);
  protected hasEmailError = (): boolean =>
    this.formErrorService.hasInvalidEmailError(this.form.get('Email'));
  protected hasPatternError = (controlName: string) =>
    this.formErrorService.hasPatternError(controlName, this.form);
  protected passwordMismatchError = (): boolean =>
    this.formErrorService.hasPasswordMismatchError(this.form);
}
