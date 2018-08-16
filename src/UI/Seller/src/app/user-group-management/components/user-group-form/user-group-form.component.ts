import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserGroup } from '@ordercloud/angular-sdk';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppFormErrorService, AppIdValidator } from '@app-seller/shared';

@Component({
  selector: 'user-group-form',
  templateUrl: './user-group-form.component.html',
  styleUrls: ['./user-group-form.component.scss'],
})
export class UserGroupFormComponent implements OnInit {
  private _existingUserGroup: UserGroup = {};
  @Input() btnText: string;
  @Output() formSubmitted = new EventEmitter();
  userGroupForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private formErrorService: AppFormErrorService
  ) {}

  ngOnInit() {
    this.setForm();
  }

  @Input()
  set existingUserGroup(group: UserGroup) {
    this._existingUserGroup = group || {};
    if (!this.userGroupForm) {
      this.setForm();
      return;
    }
    this.userGroupForm.setValue({
      ID: this._existingUserGroup.ID || '',
      Name: this._existingUserGroup.Name || '',
      Description: this._existingUserGroup.Description || '',
    });
  }

  setForm() {
    this.userGroupForm = this.formBuilder.group({
      ID: [this._existingUserGroup.ID || '', AppIdValidator()],
      Name: [this._existingUserGroup.Name || '', Validators.required],
      Description: [this._existingUserGroup.Description || ''],
    });
  }

  protected onSubmit() {
    if (this.userGroupForm.status === 'INVALID') {
      return this.formErrorService.displayFormErrors(this.userGroupForm);
    }

    const group = {
      ...this.userGroupForm.value,
      prevID: this._existingUserGroup.ID,
      xp: { Featured: this.userGroupForm.value.Featured },
    };

    this.formSubmitted.emit(group);
  }

  // control display of error messages
  protected hasRequiredError = (controlName: string) =>
    this.formErrorService.hasRequiredError(controlName, this.userGroupForm);
  protected hasInvalidIdError = () =>
    this.formErrorService.hasInvalidIdError(this.userGroupForm.get('ID'));
}
