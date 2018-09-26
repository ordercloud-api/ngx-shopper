import { ProductQtyValidator } from '@app-buyer/shared/validators/product-quantity/product.quantity.validator';
import { FormControl } from '@angular/forms';

describe('ProductQtyValidator', () => {
  it('should not error on an empty string', () => {
    expect(ProductQtyValidator({})(new FormControl(''))).toBeNull();
  });
  it('should not error on null', () => {
    expect(ProductQtyValidator({})(new FormControl(null))).toBeNull();
  });
  it('should return a validation error on small values', () => {
    const mockProduct = {
      PriceSchedule: { MinQuantity: 2 },
    };
    expect(ProductQtyValidator(mockProduct)(new FormControl(1))).toEqual({
      ProductQuantityError: {
        message: 'At least 2 must be ordered.',
        outOfStock: false,
      },
    });
  });
  it('should not error on big values', () => {
    const mockProduct = {
      PriceSchedule: { MinQuantity: 2 },
    };
    expect(ProductQtyValidator(mockProduct)(new FormControl(3))).toBe(null);
  });
  it('should not error on equal values', () => {
    const mockProduct = {
      PriceSchedule: { MinQuantity: 2 },
    };
    expect(ProductQtyValidator(mockProduct)(new FormControl(2))).toBe(null);
  });
  it('should not error on quantity less than QuantityAvailable', () => {
    const mockProduct = {
      Inventory: { QuantityAvailable: 7 },
      PriceSchedule: { MaxQuantity: 10 },
    };
    expect(ProductQtyValidator(mockProduct)(new FormControl(1))).toBeNull();
  });
  it('should return a validation error on value larger than max', () => {
    const mockProduct = {
      Inventory: { QuantityAvailable: 7 },
      PriceSchedule: { MaxQuantity: 10 },
    };
    expect(ProductQtyValidator(mockProduct)(new FormControl(11))).toEqual({
      ProductQuantityError: {
        message: 'At most 10 allowed per order.',
        outOfStock: false,
      },
    });
  });
  it('should not error on quantity equal to QuantityAvailable', () => {
    const mockProduct = {
      Inventory: { QuantityAvailable: 7 },
      PriceSchedule: { MaxQuantity: 10 },
    };
    expect(ProductQtyValidator(mockProduct)(new FormControl(7))).toBe(null);
  });
});
