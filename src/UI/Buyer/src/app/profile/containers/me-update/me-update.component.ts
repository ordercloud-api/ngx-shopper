import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { OcMeService, MeUser, OcAuthService } from '@ordercloud/angular-sdk';
import { flatMap } from 'rxjs/operators';
import {
  applicationConfiguration,
  AppConfig,
} from '@app-buyer/config/app.config';
import { AppStateService } from '@app-buyer/shared/services/app-state/app-state.service';
import { AppFormErrorService } from '@app-buyer/shared/services/form-error/form-error.service';
import { ModalService } from '@app-buyer/shared/services/modal/modal.service';
import { RegexService } from '@app-buyer/shared/services/regex/regex.service';

@Component({
  selector: 'profile-meupdate',
  templateUrl: './me-update.component.html',
  styleUrls: ['./me-update.component.scss'],
})
export class MeUpdateComponent implements OnInit, OnDestroy {
  form: FormGroup;
  me: MeUser;
  alive = true;
  changePasswordModalId = 'forgotPasswordModal';

  constructor(
    private appStateService: AppStateService,
    private formBuilder: FormBuilder,
    private formErrorService: AppFormErrorService,
    private modalService: ModalService,
    private ocAuthService: OcAuthService,
    private ocMeService: OcMeService,
    private toastrService: ToastrService,
    private regexService: RegexService,
    @Inject(applicationConfiguration) protected appConfig: AppConfig
  ) {}

  ngOnInit() {
    this.setForm();
    this.getMeData();
  }

  private setForm() {
    this.form = this.formBuilder.group({
      Username: ['', Validators.required],
      FirstName: [
        '',
        [Validators.required, Validators.pattern(this.regexService.HumanName)],
      ],
      LastName: [
        '',
        [Validators.required, Validators.pattern(this.regexService.HumanName)],
      ],
      Email: ['', [Validators.required, Validators.email]],
      Phone: ['', Validators.pattern(this.regexService.Phone)],
    });
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
        flatMap(() =>
          this.ocMeService.ResetPasswordByToken({
            NewPassword: newPassword,
          })
        )
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
  protected hasEmailError = (): boolean =>
    this.formErrorService.hasInvalidEmailError(this.form.get('Email'));
  protected hasPatternError = (controlName: string) =>
    this.formErrorService.hasPatternError(controlName, this.form);
  protected passwordMismatchError = (): boolean =>
    this.formErrorService.hasPasswordMismatchError(this.form);
}
