import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';
import { BuyerProduct } from '@ordercloud/angular-sdk';

/**
 * validate against the min quantity defined by an
 * ordercloud product's price schedule
 */
export function AppMinProductQty(product: BuyerProduct): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const minQty = getMinQty(product);

    if (!control.value) {
      return null;
    }
    if (control.value >= minQty) {
      return null;
    }
    return { OcMinProductQty: { min: minQty, actual: control.value } };
  };
}

function getMinQty(product: BuyerProduct): number {
  let minQuantity = 1;
  if (product.PriceSchedule && product.PriceSchedule.MinQuantity) {
    minQuantity = product.PriceSchedule.MinQuantity;
  }
  return minQuantity;
}

/**
 * validate against the max quantity defined by an
 * ordercloud product's price schedule
 */
export function AppMaxProductQty(product: BuyerProduct): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const maxQty = getMaxQty(product);

    if (!control.value) {
      return null;
    }
    if (control.value <= maxQty) {
      return null;
    }
    return { OcMaxProductQty: { max: maxQty, actual: control.value } };
  };
}

function getMaxQty(product: BuyerProduct): number {
  let quantityAvailable = Infinity;
  let permissionLimit = Infinity;

  if (product.Inventory && product.Inventory.QuantityAvailable != null) {
    quantityAvailable = product.Inventory.QuantityAvailable;
  }
  if (product.PriceSchedule && product.PriceSchedule.MaxQuantity != null) {
    permissionLimit = product.PriceSchedule.MaxQuantity;
  }
  return Math.min(quantityAvailable, permissionLimit);
}
