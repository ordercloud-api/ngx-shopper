import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

/**
 * Our date inputs use ngbDatepicker but also allow freeform entry.
 * We need to validate the free form entry strings without producing
 * errors with ngbDatepicker, which returns a date object
 */

export function DateValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    // only validate if both fields have been touched
    if (control.value == null || control.value === '') {
      return null;
    }

    if (
      control.value instanceof Date &&
      control.value.getFullYear().toString().length === 4
    ) {
      return null;
    }

    return { DateError: true };
  };
}
