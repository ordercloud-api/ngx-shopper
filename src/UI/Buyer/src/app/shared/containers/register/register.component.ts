import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {
  OcMeService,
  OcTokenService,
  MeUser,
  OcAuthService,
} from '@ordercloud/angular-sdk';
import { tap, takeWhile, flatMap } from 'rxjs/operators';
import {
  applicationConfiguration,
  AppConfig,
} from '@app-buyer/config/app.config';
import { AppStateService } from '@app-buyer/shared/services/app-state/app-state.service';
import { AppFormErrorService } from '@app-buyer/shared/services/form-error/form-error.service';
import { AppMatchFieldsValidator } from '@app-buyer/shared/validators/match-fields/match-fields.validator';
import { ModalService } from '@app-buyer/shared/services/modal/modal.service';
import { RegexService } from '@app-buyer/shared/services/regex/regex.service';

@Component({
  selector: 'shared-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit, OnDestroy {
  form: FormGroup;
  me: MeUser;
  alive = true;
  appName: string;
  shouldAllowUpdate: boolean;
  changePasswordModalId = 'forgotPasswordModal';

  constructor(
    private activatedRoute: ActivatedRoute,
    private appStateService: AppStateService,
    private formBuilder: FormBuilder,
    private formErrorService: AppFormErrorService,
    private modalService: ModalService,
    private ocAuthService: OcAuthService,
    private ocMeService: OcMeService,
    private ocTokenService: OcTokenService,
    private router: Router,
    private toastrService: ToastrService,
    private regexService: RegexService,
    @Inject(applicationConfiguration) private appConfig: AppConfig
  ) {
    this.appName = this.appConfig.appname;
  }

  ngOnInit() {
    this.identifyShouldAllowUpdate();
    this.setForm();
    if (this.shouldAllowUpdate) {
      this.getMeData();
    }
  }

  private identifyShouldAllowUpdate() {
    /**
     * this component is used in two places:
     * in auth when first registering (!shouldAllowUpdate)
     * in profile when editing current user (shouldAllowUpdate)
     */
    this.activatedRoute.data
      .pipe(
        takeWhile(() => this.alive),
        tap(({ shouldAllowUpdate }) => {
          this.shouldAllowUpdate = shouldAllowUpdate;
        })
      )
      .subscribe();
  }

  openChangePasswordModal() {
    this.modalService.open(this.changePasswordModalId);
  }

  private setForm() {
    const formObj = {
      Username: ['', Validators.required],
      FirstName: [
        '',
        [Validators.required, Validators.pattern(this.regexService.HumanName)],
      ],
      LastName: [
        '',
        [Validators.required, Validators.pattern(this.regexService.HumanName)],
      ],
      Email: [
        '',
        [Validators.required, Validators.pattern(this.regexService.Email)],
      ],
      Phone: ['', Validators.pattern(this.regexService.Phone)],
    };

    const validatorObj = this.shouldAllowUpdate
      ? {}
      : { validator: AppMatchFieldsValidator('Password', 'ConfirmPassword') };
    if (!this.shouldAllowUpdate) {
      Object.assign(formObj, {
        Password: ['', [Validators.required, Validators.minLength(8)]],
        ConfirmPassword: ['', [Validators.required, Validators.minLength(8)]],
      });
    }
    this.form = this.formBuilder.group(formObj, validatorObj);
  }

  onChangePassword({ currentPassword, newPassword }) {
    return this.ocAuthService
      .Login(
        this.me.Username,
        currentPassword,
        this.appConfig.clientID,
        this.appConfig.scope
      )
      .pipe(
        flatMap(() => {
          return this.ocMeService.ResetPasswordByToken({
            NewPassword: newPassword,
          });
        })
      )
      .subscribe(() => {
        this.toastrService.success('Account Info Updated', 'Success');
        this.modalService.close(this.changePasswordModalId);
      });
  }

  onSubmit() {
    if (this.form.status === 'INVALID') {
      return this.formErrorService.displayFormErrors(this.form);
    }

    const me = <MeUser>this.form.value;
    me.Active = true;

    if (this.shouldAllowUpdate) {
      this.update(me);
    } else {
      this.register(me);
    }
  }

  private register(me) {
    this.ocMeService
      .Register(this.ocTokenService.GetAccess(), me)
      .subscribe(() => {
        this.toastrService.success('New User Created');
        this.router.navigate(['/login']);
      });
  }

  private update(me) {
    this.ocMeService.Patch(me).subscribe((res) => {
      this.appStateService.userSubject.next(res);
      this.toastrService.success('Account Info Updated');
    });
  }

  private getMeData() {
    this.ocMeService.Get().subscribe((me) => {
      this.me = me;
      this.form.setValue({
        Username: me.Username,
        FirstName: me.FirstName,
        LastName: me.LastName,
        Phone: me.Phone,
        Email: me.Email,
      });
    });
  }

  ngOnDestroy() {
    this.alive = false;
  }

  // control display of error messages
  protected hasRequiredError = (controlName: string): boolean =>
    this.formErrorService.hasRequiredError(controlName, this.form);
  protected hasPatternError = (controlName: string) =>
    this.formErrorService.hasPatternError(controlName, this.form);
  protected passwordMismatchError = (): boolean =>
    this.formErrorService.hasPasswordMismatchError(this.form);
}
