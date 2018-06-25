import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

// 3rd party
import { BuyerAddress } from '@ordercloud/angular-sdk';
import { OcGeographyService } from '@app/shared/services/oc-geography/oc-geography.service';
import { OcFormErrorService } from '@app/shared/services/oc-form-error/oc-form-error.service';

@Component({
  selector: 'shared-address-form',
  templateUrl: './address-form.component.html',
  styleUrls: ['./address-form.component.scss']
})
export class AddressFormComponent implements OnInit {
  private _existingAddress: BuyerAddress;
  @Input() btnText: string;
  @Output() formSubmitted = new EventEmitter();
  stateOptions: string[];
  addressForm: FormGroup;

  constructor(
    private ocGeography: OcGeographyService,
    private formBuilder: FormBuilder,
    private formErrorService: OcFormErrorService) {
    this.stateOptions = this.ocGeography.getStates().map(s => s.abbreviation);
  }

  ngOnInit() {
    this.setForm();
  }

  @Input() set existingAddress(address: BuyerAddress) {
    this._existingAddress = address || {};
    this.setForm();
  }

  setForm() {
    this.addressForm = this.formBuilder.group({
      firstName: [this._existingAddress.FirstName || '', Validators.required],
      lastName: [this._existingAddress.LastName || '', Validators.required],
      email: [
        this._existingAddress.xp && this._existingAddress.xp.Email ? this._existingAddress.xp.Email : '',
        [Validators.required, Validators.email]
      ],
      street1: [this._existingAddress.Street1 || '', Validators.required],
      street2: [this._existingAddress.Street2 || ''],
      city: [this._existingAddress.City || '', Validators.required],
      state: [this._existingAddress.State || null, Validators.required],
      zip: [this._existingAddress.Zip || '', Validators.required],
      phone: [this._existingAddress.Phone || '', Validators.required],
    });
  }

  protected onSubmit() {
    if (this.addressForm.status === 'INVALID') {
      return this.formErrorService.displayFormErrors(this.addressForm);
    }
    const address = {
      ...this.addressForm.value,
      Country: 'US',
      xp: { Email: this.addressForm.value.email }
    };
    delete address.email;

    this.formSubmitted.emit(address);
  }

  // control display of error messages
  protected hasRequiredError = (controlName: string) => this.formErrorService.hasRequiredError(controlName, this.addressForm);
  protected hasValidEmailError = () => this.formErrorService.hasValidEmailError(this.addressForm.get('email'));
}
