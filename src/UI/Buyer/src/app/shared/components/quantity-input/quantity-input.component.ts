import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BuyerProduct } from '@ordercloud/angular-sdk';
import { OcMinProductQty, OcMaxProductQty } from '@app/shared/validators/oc-product-quantity/oc-product.quantity.validator';
import { ToastrService } from 'ngx-toastr';
import { AddToCartEvent } from '@app/shared/models/add-to-cart-event.interface';

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
    this.form = this.formBuilder.group({
      quantity: [this.existingQty,
      [
        Validators.required,
        OcMinProductQty(this.product),
        OcMaxProductQty(this.product)]
      ]
    });
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
