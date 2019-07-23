import { Component, OnInit, Input } from '@angular/core';
import { BuyerSpec } from '@ordercloud/angular-sdk';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'product-spec-form',
  templateUrl: './spec-form.component.html',
  styleUrls: ['./spec-form.component.scss'],
})
export class SpecFormComponent implements OnInit {
  @Input() specs: BuyerSpec[];
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
}
