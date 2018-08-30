import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Category } from '@ordercloud/angular-sdk';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppFormErrorService } from '@app-seller/shared/services/form-error/form-error.service';
import { AppIdValidator } from '@app-seller/shared/validators/id-field/id-field.validator';

@Component({
  selector: 'category-form',
  templateUrl: './category-form.component.html',
  styleUrls: ['./category-form.component.scss'],
})
export class CategoryFormComponent implements OnInit {
  private _existingCategory: Category = {};
  @Input()
  btnText: string;
  @Output()
  formSubmitted = new EventEmitter();
  categoryForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private formErrorService: AppFormErrorService
  ) {}

  ngOnInit() {
    this.setForm();
  }

  @Input()
  set existingCategory(category: Category) {
    this._existingCategory = category || {};
    if (!this.categoryForm) {
      this.setForm();
      return;
    }
    this.categoryForm.setValue({
      ID: this._existingCategory.ID || '',
      Name: this._existingCategory.Name || '',
      Description: this._existingCategory.Description || '',
      Active: !!this._existingCategory.Active,
    });
  }

  setForm() {
    this.categoryForm = this.formBuilder.group({
      ID: [this._existingCategory.ID || '', AppIdValidator()],
      Name: [this._existingCategory.Name || '', Validators.required],
      Description: [this._existingCategory.Description || ''],
      Active: [!!this._existingCategory.Active],
    });
  }

  protected onSubmit() {
    if (this.categoryForm.status === 'INVALID') {
      return this.formErrorService.displayFormErrors(this.categoryForm);
    }

    this.formSubmitted.emit(this.categoryForm.value);
  }

  // control display of error messages
  protected hasRequiredError = (controlName: string) =>
    this.formErrorService.hasRequiredError(controlName, this.categoryForm);
  protected hasInvalidIdError = () =>
    this.formErrorService.hasInvalidIdError(this.categoryForm.get('ID'));
}
