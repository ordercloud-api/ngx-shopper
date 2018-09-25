import { AbstractControl, ValidationErrors } from '@angular/forms';

// Zip Code validation. The main function, ValidataZip(), can use different rules based on country.

export function ValidateZip(control: AbstractControl): ValidationErrors | null {
  const rules: RegExp = selectRules();
  const isValid: boolean = rules.test(control.value);

  if (!control.value) {
    return null;
  }
  if (isValid) {
    return null;
  }

  return { zipInvalid: true };
}

// Modify this function to select different rules based on location.
function selectRules(): RegExp {
  return USZipRules;
}

// Add regular expressions for new rules types as needed. Exported for testing purposes only. Do not import.

export const USZipRules = /^[0-9]{5}$/; // five numbers

export const CAZipRules = /^[A-Z0-9]{3}\s[A-Z0-9]{3}$/; // Two groups of three alphanumerics, i.e. "A1A 5TT"
