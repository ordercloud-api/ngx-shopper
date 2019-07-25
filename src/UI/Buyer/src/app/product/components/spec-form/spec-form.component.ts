import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BuyerSpec } from '@ordercloud/angular-sdk';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {
  find as _find,
  keys as _keys,
  pickBy as _pickBy,
  identity as _identity,
} from 'lodash';
import { FullSpecOption } from '@app-buyer/product/containers/product-details/product-details.component';

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
      const value: any = [this.getDefaultOption(spec)];
      if (spec.Required) value.push(Validators.required);
      formObj[spec.ID] = value;
    });
    this.specForm = this.formBuilder.group(formObj);
    this.onChange();
  }

  getDefaultOption(spec: BuyerSpec) {
    return spec.DefaultOptionID || (spec.Required ? spec.Options[0].ID : null);
  }

  onChange() {
    const specIDs = _keys(_pickBy(this.specForm.value, _identity));
    const selections: FullSpecOption[] = specIDs.map((specID) => {
      const spec = this.specs.find((s) => s.ID === specID);
      const optionID = this.specForm.value[specID];
      const option: any = spec.Options.find((o) => o.ID === optionID);
      option.SpecID = specID;
      return option;
    });
    this.formUpdated.emit(selections);
  }
}
