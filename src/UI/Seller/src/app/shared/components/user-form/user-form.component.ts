import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { User } from '@ordercloud/angular-sdk';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppFormErrorService } from '@app-seller/shared/services/form-error/form-error.service';
import { AppIdValidator } from '@app-seller/shared/validators/id-field/id-field.validator';

@Component({
  selector: 'user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss'],
})
export class UserFormComponent implements OnInit {
  protected _existingUser: User = {};
  @Input() btnText: string;
  @Output() formSubmitted = new EventEmitter();
  userForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private formErrorService: AppFormErrorService
  ) {}

  ngOnInit() {
    this.setForm();
  }

  @Input()
  set existingUser(user: User) {
    this._existingUser = user || {};
    if (!this.userForm) {
      this.setForm();
      return;
    }
    this.userForm.removeControl('Password');

    this.userForm.setValue({
      ID: this._existingUser.ID || '',
      Username: this._existingUser.Username || '',
      FirstName: this._existingUser.FirstName || '',
      LastName: this._existingUser.LastName || '',
      Phone: this._existingUser.Phone || '',
      Email: this._existingUser.Email || '',
      Active: !!this._existingUser.Active,
    });
  }

  setForm() {
    this.userForm = this.formBuilder.group({
      ID: [this._existingUser.ID || '', AppIdValidator()],
      Username: [this._existingUser.Username || '', Validators.required],
      Password: [this._existingUser.Password || '', Validators.required],
      FirstName: [this._existingUser.FirstName || '', Validators.required],
      LastName: [this._existingUser.LastName || '', Validators.required],
      Phone: [this._existingUser.Phone || ''],
      Email: [this._existingUser.Email || '', Validators.required],
      Active: [!!this._existingUser.Active],
    });
  }

  protected onSubmit() {
    if (this.userForm.status === 'INVALID') {
      return this.formErrorService.displayFormErrors(this.userForm);
    }

    this.formSubmitted.emit(this.userForm.value);
  }

  // control display of error messages
  protected hasRequiredError = (controlName: string) => {
    this.formErrorService.hasRequiredError(controlName, this.userForm);
  };
  protected hasInvalidIdError = () =>
    this.formErrorService.hasInvalidIdError(this.userForm.get('ID'));
}
