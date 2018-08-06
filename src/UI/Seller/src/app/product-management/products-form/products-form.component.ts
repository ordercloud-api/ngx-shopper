import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Product } from '@ordercloud/angular-sdk';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AppFormErrorService } from '@app-seller/shared';

@Component({
  selector: 'products-form',
  templateUrl: './products-form.component.html',
  styleUrls: ['./products-form.component.scss'],
})
export class ProductsFormComponent implements OnInit {
  private _existingProduct: Product = {};
  @Input() btnText: string;
  @Output() formSubmitted = new EventEmitter();
  productForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private formErrorService: AppFormErrorService
  ) {}

  ngOnInit() {
    this.setForm();
  }

  @Input()
  set existingProduct(product: Product) {
    this._existingProduct = product || {};
    this.setForm();
  }

  setForm() {
    this.productForm = this.formBuilder.group({
      //ID: [this._existingProduct.ID || ''],
      Name: [this._existingProduct.Name || '', Validators.required],
      Description: [this._existingProduct.Description || ''],
      Active: [this._existingProduct.Active || false],
      Featured: [this._existingProduct.xp && this._existingProduct.xp.Featured],
    });
  }

  protected onSubmit() {
    if (this.productForm.status === 'INVALID') {
      return this.formErrorService.displayFormErrors(this.productForm);
    }

    const product = {
      ...this.productForm.value,
      xp: { Featured: this.productForm.value.Featured },
    };
    delete product.Featured;

    this.formSubmitted.emit(product);
  }

  // control display of error messages
  protected hasRequiredError = (controlName: string) =>
    this.formErrorService.hasRequiredError(controlName, this.productForm);
  protected hasValidEmailError = () =>
    this.formErrorService.hasValidEmailError(this.productForm.get('Email'));
}
