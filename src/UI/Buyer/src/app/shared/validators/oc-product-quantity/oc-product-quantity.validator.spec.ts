import { OcMinProductQty, OcMaxProductQty } from '@app/shared/validators/oc-product-quantity/oc-product.quantity.validator';
import { FormControl } from '@angular/forms';

describe('OcMinProductQty Validator', () => {
    const mockProduct = { PriceSchedule: { MinQuantity: 2 } };
    it('should not error on an empty string', () => {
        expect(OcMinProductQty({})(new FormControl(''))).toBeNull();
    });
    it('should not error on null', () => {
        expect(OcMinProductQty({})(new FormControl(null))).toBeNull();
    });
    it('should return a validation error on small values', () => {
        expect(OcMinProductQty(mockProduct)(new FormControl(1))).toEqual({ OcMinProductQty: { 'min': 2, 'actual': 1 } });
    });
    it('should not error on big values', () => {
        expect(OcMinProductQty(mockProduct)(new FormControl(3))).toBe(null);
    });
    it('should not error on equal values', () => {
        expect(OcMinProductQty(mockProduct)(new FormControl(2))).toBe(null);
    });
});

describe('OcMaxProductQty Validator', () => {
    it('should not error on empty string', () => {
        expect(OcMaxProductQty({})(new FormControl(''))).toBeNull();
    });
    it('should not error on null', () => {
        expect(OcMaxProductQty({})(new FormControl(null))).toBeNull();
    });
    describe('QuantityAvailable greater than MaxQuantity', () => {
        const mockProduct = { Inventory: { QuantityAvailable: 7 }, PriceSchedule: { MaxQuantity: 10 } };
        it('should not error on quantity less than QuantityAvailable', () => {
            expect(OcMaxProductQty(mockProduct)(new FormControl(1))).toBeNull();
        });
        it('should return a validation error on value larger than MaxQuantity', () => {
            expect(OcMaxProductQty(mockProduct)(new FormControl(8))).toEqual({ OcMaxProductQty: { 'max': 7, 'actual': 8 } });
        });
        it('should not error on quantity equal to QuantityAvailable', () => {
            expect(OcMaxProductQty(mockProduct)(new FormControl(1))).toBe(null);
        });
    });
    describe('MaxQuantity greater than QuantityAvailable', () => {
        const mockProduct = { Inventory: { QuantityAvailable: 11 }, PriceSchedule: { MaxQuantity: 7 } };
        it('should not error on quantity less than QuantityAvailable', () => {
            expect(OcMaxProductQty(mockProduct)(new FormControl(1))).toBeNull();
        });
        it('should return a validation error on value larger than MaxQuantity', () => {
            expect(OcMaxProductQty(mockProduct)(new FormControl(8))).toEqual({ OcMaxProductQty: { 'max': 7, 'actual': 8 } });
        });
        it('should not error on quantity equal to QuantityAvailable', () => {
            expect(OcMaxProductQty(mockProduct)(new FormControl(1))).toBe(null);
        });
    });
});
