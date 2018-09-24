import {
  ValidateZip,
  USZipRules,
  CAZipRules,
} from '@app-buyer/shared/validators/zip-code/zip-code.validator';
import { FormControl } from '@angular/forms';

describe('ValidateZip Validator', () => {
  it('should not error on an empty string', () => {
    expect(ValidateZip(new FormControl(''))).toBeNull();
  });
  it('should not error on null', () => {
    expect(ValidateZip(new FormControl(null))).toBeNull();
  });
  describe('US', () => {
    it('should fail if there are any characters not 0-9', () => {
      expect(USZipRules.test('a1111')).toEqual(false);
      expect(USZipRules.test('!1111')).toEqual(false);
      expect(USZipRules.test('#1111')).toEqual(false);
      expect(USZipRules.test('_1111')).toEqual(false);
      expect(USZipRules.test('*1111')).toEqual(false);
      expect(USZipRules.test('A1111')).toEqual(false);
      expect(USZipRules.test(',1111')).toEqual(false);
    });
    it('should fail if the length is not 5', () => {
      expect(USZipRules.test('111111')).toEqual(false);
      expect(USZipRules.test('1')).toEqual(false);
      expect(USZipRules.test('1111')).toEqual(false);
    });
    it('should pass if a valid US zip code', () => {
      expect(USZipRules.test('11111')).toEqual(true);
      expect(USZipRules.test('55409')).toEqual(true);
    });
  });
  describe('Canada', () => {
    it('should fail if any characters not 0-9A-Z', () => {
      expect(CAZipRules.test('A11 A1a')).toEqual(false);
      expect(CAZipRules.test('A11 A1,')).toEqual(false);
      expect(CAZipRules.test('A11 A1!')).toEqual(false);
      expect(CAZipRules.test('A11 A1*')).toEqual(false);
      expect(CAZipRules.test('A11 A1#')).toEqual(false);
      expect(CAZipRules.test('A11 A1$')).toEqual(false);
    });
    it('should fail if not two groups of three separated by a space', () => {
      expect(CAZipRules.test('A11A1A')).toEqual(false);
      expect(CAZipRules.test('A1 A1A')).toEqual(false);
      expect(CAZipRules.test('A11A 1AA')).toEqual(false);
      expect(CAZipRules.test('A11A1AA')).toEqual(false);
      expect(CAZipRules.test('A1 1A1A')).toEqual(false);
      expect(CAZipRules.test('A11A 1A')).toEqual(false);
      expect(CAZipRules.test('A 1 1 A 1 A')).toEqual(false);
    });
    it('should pass if a valid CA zip code', () => {
      expect(CAZipRules.test('A11 A1A')).toEqual(true);
    });
  });
});
