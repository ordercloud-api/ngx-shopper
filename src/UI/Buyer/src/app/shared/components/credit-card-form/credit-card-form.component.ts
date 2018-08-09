import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CreateCardDetails } from '@app-buyer/shared';
import { AppFormErrorService } from '@app-buyer/shared/services/form-error/form-error.service';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import {
  faCcVisa,
  faCcMastercard,
  faCcDiscover,
} from '@fortawesome/free-brands-svg-icons';

@Component({
  selector: 'shared-credit-card-form',
  templateUrl: './credit-card-form.component.html',
  styleUrls: ['./credit-card-form.component.scss'],
})
export class CreditCardFormComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private formErrorService: AppFormErrorService
  ) {}

  @Output() formSubmitted = new EventEmitter<CreateCardDetails>();
  faCcVisa = faCcVisa;
  faCcMastercard = faCcMastercard;
  faCcDiscover = faCcDiscover;
  cardForm: FormGroup;
  faPlus = faPlus;
  yearOptions: string[];
  monthOptions: string[];

  ngOnInit() {
    const start = new Date().getFullYear();
    this.yearOptions = Array(20)
      .fill(0)
      .map((_x, i) => `${i + start}`);
    this.monthOptions = Array(12)
      .fill(0)
      .map((_x, i) => `0${i + 1}`.slice(-2));

    this.cardForm = this.formBuilder.group({
      CardNumber: ['', Validators.required],
      CardholderName: ['', Validators.required],
      expMonth: [this.monthOptions[0], Validators.required],
      expYear: [this.yearOptions[0].slice(-2), Validators.required],
      CardCode: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.cardForm.status === 'INVALID') {
      this.formErrorService.displayFormErrors(this.cardForm);
      return;
    }

    const date = `${this.cardForm.value.expMonth}${
      this.cardForm.value.expYear
    }`;
    const card = { ExpirationDate: date, ...this.cardForm.value };
    delete card.expMonth;
    delete card.expYear;
    this.formSubmitted.emit(card);
  }

  // control display of required error messages
  protected hasRequiredError = (controlName: string) =>
    this.formErrorService.hasRequiredError(controlName, this.cardForm);
}
