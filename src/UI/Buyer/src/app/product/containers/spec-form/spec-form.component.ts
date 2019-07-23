import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BuyerSpec, SpecOption } from '@ordercloud/angular-sdk';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CurrencyPipe } from '@angular/common';
import { FullSpecOption } from '../product-details/product-details.component';
import { find as _find, keys as _keys } from 'lodash';
import { Options } from 'selenium-webdriver/chrome';

@Component({
  selector: 'product-spec-form',
  templateUrl: './spec-form.component.html',
  styleUrls: ['./spec-form.component.scss'],
})
export class SpecFormComponent implements OnInit {
  @Input() specs: BuyerSpec[];
  @Output() formUpdated = new EventEmitter<FullSpecOption[]>();
  specForm: FormGroup;
  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    const formObj = {};
    this.specs.forEach((spec) => {
      const value: any = [spec.DefaultOptionID || null];
      if (spec.Required) value.push(Validators.required);
      formObj[spec.ID] = value;
    });
    this.specForm = this.formBuilder.group(formObj);
  }

  onChange() {
    const selections: FullSpecOption[] = _keys(this.specForm.value).map(
      (specID) => {
        const spec = this.specs.find((s) => s.ID === specID);
        const optionID = this.specForm.value[specID];
        const option: any = spec.Options.find((o) => o.ID === optionID);
        option.SpecID = specID;
        return option;
      }
    );
    this.formUpdated.emit(selections);
  }

  getMarkupText(option: SpecOption): string {
    const pipe = new CurrencyPipe('en-US');
    switch (option.PriceMarkupType) {
      case 'NoMarkup':
        return '';
      case 'AmountPerQuantity':
        return `(+${pipe.transform(option.PriceMarkup)} per unit)`;
      case 'AmountTotal':
        return `(+${pipe.transform(option.PriceMarkup)} per order)`;
      case 'Percentage':
        return `(+${option.PriceMarkup}%)`;
    }
  }
}
