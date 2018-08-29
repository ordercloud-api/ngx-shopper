import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

import { BuyerAddress } from '@ordercloud/angular-sdk';
import { AppFormErrorService } from '@app-seller/shared/services/form-error/form-error.service';
import { AppGeographyService } from '@app-seller/shared/services/geography/geography.service';
import { AppIdValidator } from '@app-seller/shared/validators/id-field/id-field.validator';

@Component({
  selector: 'shared-address-form',
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.scss'],
})
export class AddressFormComponent implements OnInit {
  private _existingAddress: BuyerAddress = {};
  @Input() btnText: string;
  @Output() formSubmitted = new EventEmitter();
  stateOptions: string[];
  countryOptions: { label: string; abbreviation: string }[];
  addressForm: FormGroup;

  constructor(
    private geographyService: AppGeographyService,
    private formBuilder: FormBuilder,
    private formErrorService: AppFormErrorService
  ) {
    this.stateOptions = this.geographyService
      .getStates()
      .map((s) => s.abbreviation);
    this.countryOptions = this.geographyService.getCountries();
  }

  ngOnInit() {
    this.setForm();
  }

  @Input()
  set existingAddress(address: BuyerAddress) {
    this._existingAddress = address || {};
    if (!this.addressForm) {
      this.setForm();
      return;
    }

    this.addressForm.setValue({
      ID: this._existingAddress.ID || '',
      AddressName: this._existingAddress.AddressName || '',
      FirstName: this._existingAddress.FirstName || '',
      LastName: this._existingAddress.LastName || '',
      Street1: this._existingAddress.Street1 || '',
      Street2: this._existingAddress.Street2 || '',
      City: this._existingAddress.City || '',
      State: this._existingAddress.State || null,
      Zip: this._existingAddress.Zip || '',
      Country: this._existingAddress.Country || null,
      Phone: this._existingAddress.Phone || '',
    });
  }

  setForm() {
    this.addressForm = this.formBuilder.group({
      ID: [this._existingAddress.ID || '', AppIdValidator()],
      AddressName: this._existingAddress.AddressName || '',
      FirstName: [this._existingAddress.FirstName || '', Validators.required],
      LastName: [this._existingAddress.LastName || '', Validators.required],
      Street1: [this._existingAddress.Street1 || '', Validators.required],
      Street2: [this._existingAddress.Street2 || ''],
      City: [this._existingAddress.City || '', Validators.required],
      State: [this._existingAddress.State || null, Validators.required],
      Zip: [this._existingAddress.Zip || '', Validators.required],
      Country: [this._existingAddress.Country || null, Validators.required],
      Phone: [this._existingAddress.Phone || ''],
    });
  }

  protected onSubmit() {
    if (this.addressForm.status === 'INVALID') {
      return this.formErrorService.displayFormErrors(this.addressForm);
    }
    this.formSubmitted.emit(this.addressForm.value);
  }

  // control display of error messages
  protected hasRequiredError = (controlName: string) =>
    this.formErrorService.hasRequiredError(controlName, this.addressForm);
  protected hasInvalidIdError = () =>
    this.formErrorService.hasInvalidIdError(this.addressForm.get('ID'));
}
