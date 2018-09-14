import { ValidateStrongPassword } from '@app-buyer/shared/validators/strong-password/strong-password.validator';
import { FormControl } from '@angular/forms';

describe('ValidateStrongPassword Validator', () => {
  it('should not error on an empty string', () => {
    expect(ValidateStrongPassword(new FormControl(''))).toBeNull();
  });
  it('should not error on null', () => {
    expect(ValidateStrongPassword(new FormControl(null))).toBeNull();
  });
  it('should return a validation error if length is less than 8 characters', () => {
    expect(ValidateStrongPassword(new FormControl('abc123'))).toEqual({
      strongPassword: true,
    });
  });
  it('should return validation error if there is no numbers', () => {
    expect(ValidateStrongPassword(new FormControl('abcdefghijkl'))).toEqual({
      strongPassword: true,
    });
  });
  it('should return validation error if there is no letters', () => {
    expect(ValidateStrongPassword(new FormControl('12345678910'))).toEqual({
      strongPassword: true,
    });
  });
  it('should be valid if greater than 8 characters, with at least one number and one letter', () => {
    expect(ValidateStrongPassword(new FormControl('fails345'))).toBeNull();
  });
  it('should handle password with special characters', () => {
    expect(
      ValidateStrongPassword(new FormControl('awe3somesauce!*(#F'))
    ).toBeNull();
  });
});
