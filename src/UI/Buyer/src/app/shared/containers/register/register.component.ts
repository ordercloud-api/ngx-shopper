import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MeService, TokenService } from '@ordercloud/angular-sdk';
import { tap } from 'rxjs/operators';
import { applicationConfiguration, AppConfig } from '@app/config/app.config';
import { OcMatchFieldsValidator } from '@app/shared/validators/oc-match-fields/oc-match-fields.validator';
import { AppStateService } from '@app/shared/services/app-state/app-state.service';
import { OcFormErrorService } from '@app/shared/services/oc-form-error/oc-form-error.service';

@Component({
  selector: 'shared-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  shouldAllowUpdate: boolean;
  form: FormGroup;
  appName: string;

  constructor(
    private fb: FormBuilder,
    private meService: MeService,
    private tokenService: TokenService,
    private toasterService: ToastrService,
    private router: Router,
    private appStateService: AppStateService,
    private activatedRoute: ActivatedRoute,
    private formErrorService: OcFormErrorService,
    @Inject(applicationConfiguration) private appConfig: AppConfig) {
    this.appName = this.appConfig.appname;
    this.activatedRoute.data
      .pipe(
        tap(({ shouldAllowUpdate }) => this.shouldAllowUpdate = shouldAllowUpdate)
      )
      .subscribe();
  }

  ngOnInit() {
    this.setForm();
    if (this.shouldAllowUpdate) {
      this.getMeData();
    }
  }

  private setForm() {
    const formObj = {
      FirstName: ['', Validators.required],
      LastName: ['', Validators.required],
      Email: ['', [Validators.required, Validators.email]],
      Phone: [''],
    };

    const validatorObj = this.shouldAllowUpdate ? {} : { validator: OcMatchFieldsValidator('Password', 'ConfirmPassword') };
    if (!this.shouldAllowUpdate) {
      Object.assign(formObj, {
        Password: ['', [Validators.required, Validators.minLength(8)]],
        ConfirmPassword: ['', [Validators.required, Validators.minLength(8)]]
      });
    }
    this.form = this.fb.group(formObj, validatorObj);
  }

  onSubmit() {
    if (this.form.status === 'INVALID') {
      return this.formErrorService.displayFormErrors(this.form);
    }

    const me = this.form.value;
    me.Username = me.Email;
    me.Active = true;

    if (this.shouldAllowUpdate) {
      this.update(me);
    } else {
      this.register(me);
    }
  }

  private register(me) {
    this.meService.Register(this.tokenService.GetAccess(), me).subscribe(() => {
      this.toasterService.success('New User Created');
      this.router.navigate(['/login']);
    }, error => {
      throw error;
    });
  }

  private update(me) {
    this.meService.Patch(me).subscribe(
      res => {
        this.appStateService.userSubject.next(res);
        this.toasterService.success('Account Info Updated');
      }, error => {
        throw error;
      });
  }

  private getMeData() {
    this.meService.Get().subscribe(me => {
      this.form.setValue({
        FirstName: me.FirstName,
        LastName: me.LastName,
        Phone: me.Phone,
        Email: me.Email,
      });
    });
  }

  // control display of error messages
  protected hasRequiredError = (controlName: string): boolean => this.formErrorService.hasRequiredError(controlName, this.form);
  protected hasValidEmailError = (): boolean => this.formErrorService.hasValidEmailError(this.form.get('Email'));
  protected passwordMismatchError = (): boolean => this.formErrorService.hasPasswordMismatchError(this.form);
}
