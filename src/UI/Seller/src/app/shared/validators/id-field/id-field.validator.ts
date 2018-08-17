import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

// ID field in the OC API can only contain characters Aa-Zz 0-9 - _. Note, no spaces allowed.
// This custom validator will be applyed to ID fields and will mark them invalid.

export function AppIdValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    // only validate if field has been touched
    if (control.pristine) {
      return null;
    }
    const regex = new RegExp('^[a-zA-Z0-9_-]*$');

    // If field has only Aa-Zz 0-9 - _ it will match the regular expression.
    if (regex.test(control.value)) {
      return null;
    }
    return { invalidIdError: true };
  };
}
