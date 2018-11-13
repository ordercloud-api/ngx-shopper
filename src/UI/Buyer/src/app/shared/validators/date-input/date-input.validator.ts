import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

/**
 * Our date inputs use ngbDatepicker but also allow freeform entry.
 * We need to validate the free form entry strings which are converted to date objects
 */

export function DateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    // only validate if both fields have been touched
    if (control.value == null || control.value === '') {
      return null;
    }

    if (
      // the user's text input is converted to Date() if days and months check out
      control.value instanceof Date &&
      // validate that the year is also within reasonable range
      control.value.getFullYear().toString().length === 4
    ) {
      return null;
    }

    return { DateError: true };
  };
}
