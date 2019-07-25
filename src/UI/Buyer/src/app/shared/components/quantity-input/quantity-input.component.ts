import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BuyerProduct } from '@ordercloud/angular-sdk';
import { ProductQtyValidator } from '@app-buyer/shared/validators/product-quantity/product.quantity.validator';
import { ToastrService } from 'ngx-toastr';
import { AddToCartEvent } from '@app-buyer/shared/models/add-to-cart-event.interface';
import { debounceTime, takeWhile } from 'rxjs/operators';
import { AppFormErrorService } from '@app-buyer/shared/services/form-error/form-error.service';

@Component({
  selector: 'shared-quantity-input',
  templateUrl: './quantity-input.component.html',
  styleUrls: ['./quantity-input.component.scss'],
})
export class QuantityInputComponent implements OnInit, OnDestroy {
  alive = true;
  @Input() product: BuyerProduct;
  @Input() existingQty;
  @Output() qtyChanged = new EventEmitter<number>();
  @Output() addedToCart = new EventEmitter<AddToCartEvent>();
  form: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private toastrService: ToastrService,
    private formErrorService: AppFormErrorService
  ) {}

  ngOnInit(): void {
    this.form = this.formBuilder.group({
      quantity: [
        this.existingQty || this.getDefaultQty(),
        [Validators.required, ProductQtyValidator(this.product)],
      ],
    });
    this.quantityChangeListener();
  }

  isQuantityRestricted() {
    // In OC RestrictedQuantity means you can only order quantities for which a price break exists.
    return (
      this.product &&
      this.product.PriceSchedule &&
      this.product.PriceSchedule.RestrictedQuantity
    );
  }

  getDefaultQty(): number {
    return this.isQuantityRestricted()
      ? this.product.PriceSchedule.PriceBreaks[0].Quantity
      : 1;
  }

  quantityChangeListener(): void {
    this.form.valueChanges
      .pipe(
        debounceTime(500),
        takeWhile(() => this.alive)
      )
      .subscribe(() => {
        if (this.form.valid && !isNaN(this.form.value.quantity)) {
          this.qtyChanged.emit(this.form.value.quantity);
        }
      });
  }

  /**
   *  this method is not tied to anything
   *  use ViewChild to call this method
   *  from parent component, see product-details component as example
   */
  addToCart(event) {
    event.stopPropagation();
    if (!this.form.valid || isNaN(this.form.value.quantity)) {
      return this.toastrService.error(
        this.getQuantityError() || 'Please enter a quantity',
        'Error'
      );
    }
    this.addedToCart.emit({
      product: this.product,
      quantity: this.form.value.quantity,
    });
    // Reset form as indication of action
    this.form.setValue({ quantity: this.getDefaultQty() });
  }

  getQuantityError(): string | void {
    const error = this.formErrorService.getProductQuantityError(
      'quantity',
      this.form
    );
    return error ? error.message : null;
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
