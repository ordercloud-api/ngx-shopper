import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppMatchFieldsValidator } from '@app-buyer/shared/validators/match-fields/match-fields.validator';
import { AppFormErrorService } from '@app-buyer/shared/services/form-error/form-error.service';
import { MeUser } from '@ordercloud/angular-sdk';
import { ValidateStrongPassword } from '@app-buyer/shared/validators/strong-password/strong-password.validator';

@Component({
  selector: 'profile-change-password-form',
  templateUrl: './change-password-form.component.html',
  styleUrls: ['./change-password-form.component.scss'],
})
export class ChangePasswordFormComponent implements OnInit {
  form: FormGroup;
  me: MeUser;
  faTimes = faTimes;
  @Output()
  changePassword = new EventEmitter<{
    currentPassword: string;
    newPassword: string;
  }>();

  constructor(
    private formBuilder: FormBuilder,
    private formErrorService: AppFormErrorService
  ) {}

  ngOnInit() {
    this.setForm();
  }

  setForm() {
    this.form = this.formBuilder.group(
      {
        currentPassword: ['', Validators.required],
        newPassword: [
          '',
          [
            Validators.required,
            ValidateStrongPassword, // password must include one number, one letter and have min length of 8
          ],
        ],
        confirmNewPassword: [''],
      },
      {
        validator: AppMatchFieldsValidator('newPassword', 'confirmNewPassword'),
      }
    );
  }

  updatePassword() {
    if (this.form.status === 'INVALID') {
      return this.formErrorService.displayFormErrors(this.form);
    }
    const { currentPassword, newPassword } = this.form.value;
    this.changePassword.emit({ currentPassword, newPassword });
    this.form.reset();
  }

  // control display of error messages
  protected hasRequiredError = (controlName: string): boolean =>
    this.formErrorService.hasRequiredError(controlName, this.form);
  protected hasPasswordMismatchError = (): boolean =>
    this.formErrorService.hasPasswordMismatchError(this.form);
  protected hasStrongPasswordError = (controlName: string): boolean =>
    this.formErrorService.hasStrongPasswordError(controlName, this.form);
}
