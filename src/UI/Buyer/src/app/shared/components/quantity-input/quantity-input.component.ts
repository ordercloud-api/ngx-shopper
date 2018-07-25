import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BuyerProduct } from '@ordercloud/angular-sdk';
import { OcMinProductQty, OcMaxProductQty } from '@app-buyer/shared/validators/oc-product-quantity/oc-product.quantity.validator';
import { ToastrService } from 'ngx-toastr';
import { AddToCartEvent } from '@app-buyer/shared/models/add-to-cart-event.interface';

@Component({
  selector: 'shared-quantity-input',
  templateUrl: './quantity-input.component.html',
  styleUrls: ['./quantity-input.component.scss']
})
export class QuantityInputComponent implements OnInit {
  @Input() product: BuyerProduct;
  @Input() existingQty = 1;
  @Output() qtyChanged = new EventEmitter<number>();
  @Output() addedToCart = new EventEmitter<AddToCartEvent>();
  form: FormGroup;


  constructor(
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
  ) { }

  ngOnInit(): void {
    if (this.isQuantityRestricted()) {
      this.existingQty = this.product.PriceSchedule.PriceBreaks[0].Quantity;
    }

    this.qtyChanged.emit(this.existingQty);
    this.form = this.formBuilder.group({
      quantity: [this.existingQty,
      [
        Validators.required,
        OcMinProductQty(this.product),
        OcMaxProductQty(this.product)]
      ]
    });
  }

  isQuantityRestricted() {
    // In OC RestrictedQuantity means you can only order quantities for which a price break exists.
    return this.product && this.product.PriceSchedule && this.product.PriceSchedule.RestrictedQuantity;
  }

  quantityChanged(): void {
    if (this.form.valid && !isNaN(this.form.value.quantity)) {
      this.qtyChanged.emit(this.form.value.quantity);
    }
  }

  /**
   *  this method is not tied to anything
   *  use ViewChild to call this method
   *  from parent component, see product-details component as example
   */
  addToCart(event) {
    event.stopPropagation();
    if (this.form.valid && !isNaN(this.form.value.quantity)) {
      return this.addedToCart.emit({ product: this.product, quantity: this.form.value.quantity });
    }
    this.toastrService.error('Quantity is invalid', 'Error');
  }
}
