import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserGroup } from '@ordercloud/angular-sdk';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppFormErrorService, RegexService } from '@app-seller/shared';

@Component({
  selector: 'user-group-form',
  templateUrl: './user-group-form.component.html',
  styleUrls: ['./user-group-form.component.scss'],
})
export class UserGroupFormComponent implements OnInit {
  private _existingUserGroup: UserGroup = {};
  @Input()
  btnText: string;
  @Output()
  formSubmitted = new EventEmitter();
  userGroupForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private formErrorService: AppFormErrorService,
    private regexService: RegexService
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
      ID: [
        this._existingUserGroup.ID || '',
        Validators.pattern(this.regexService.ID),
      ],
      Name: [this._existingUserGroup.Name || '', Validators.required],
      Description: [this._existingUserGroup.Description || ''],
    });
  }

  protected onSubmit() {
    if (this.userGroupForm.status === 'INVALID') {
      return this.formErrorService.displayFormErrors(this.userGroupForm);
    }

    this.formSubmitted.emit(this.userGroupForm.value);
  }

  // control display of error messages
  protected hasRequiredError = (controlName: string) =>
    this.formErrorService.hasRequiredError(controlName, this.userGroupForm);
  protected hasPatternError = (controlName: string) =>
    this.formErrorService.hasPatternError(controlName, this.userGroupForm);
}
