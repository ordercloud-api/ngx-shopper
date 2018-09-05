import { AbstractControl, ValidationErrors } from '@angular/forms';

/**
 * validates that a given password adheres to ordercloud's password requirements
 * of at least one letter, at least one letter, and a minimum length of 8
 */
export function ValidateStrongPassword(
  control: AbstractControl
): ValidationErrors | null {
  const hasNumber = /[0-9]/.test(control.value);
  const hasLetter = /[a-zA-Z]/.test(control.value);
  const hasMinLength = control.value && control.value.length >= 8;
  if (!control.value) {
    return null;
  }
  if (hasNumber && hasLetter && hasMinLength) {
    return null;
  }
  return { strongPassword: true };
}
