import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { BuyerProduct } from '@ordercloud/angular-sdk';

export function ProductQtyValidator(product: BuyerProduct): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control.value == null || control.value === '') {
      return null;
    }
    const error = { ProductQuantityError: { message: '', outOfStock: false } };
    const min = minQty(product);
    const max = maxQty(product);
    const inventory = getInventory(product);

    if (inventory < min) {
      error.ProductQuantityError.message = `Out of stock.`;
      error.ProductQuantityError.outOfStock = true;
      return error;
    }
    if (control.value < min) {
      error.ProductQuantityError.message = `At least ${min} must be ordered.`;
      return error;
    }
    if (control.value > inventory) {
      error.ProductQuantityError.message = `Only ${inventory} available in inventory.`;
      return error;
    }
    if (control.value > max) {
      error.ProductQuantityError.message = `At most ${max} allowed per order.`;
      return error;
    }

    return null;
  };
}

/**
 * validate against the min quantity per order defined by an
 * ordercloud product's price schedule
 */
function minQty(product: BuyerProduct): number {
  if (product.PriceSchedule && product.PriceSchedule.MinQuantity) {
    return product.PriceSchedule.MinQuantity;
  }
  return 1;
}

/**
 * validate against the max quantity per order defined by an
 * ordercloud product's price schedule
 */
function maxQty(product: BuyerProduct): number {
  if (product.PriceSchedule && product.PriceSchedule.MaxQuantity != null) {
    return product.PriceSchedule.MaxQuantity;
  }
  return Infinity;
}

/**
 * validate against the inventory limit defined by an
 * ordercloud product's inventory object
 */
function getInventory(product: BuyerProduct): number {
  if (
    product.Inventory &&
    product.Inventory.Enabled &&
    !product.Inventory.OrderCanExceed &&
    product.Inventory.QuantityAvailable != null
  ) {
    return product.Inventory.QuantityAvailable;
  }
  return Infinity;
}
