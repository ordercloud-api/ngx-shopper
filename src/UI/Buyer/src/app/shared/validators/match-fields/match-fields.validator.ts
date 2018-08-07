import { ValidatorFn, AbstractControl, ValidationErrors } from '@angular/forms';

// takes the name of two form controls and validates that values are the same
// form controls must be part of the same form group see app-reset-password-form component for example

export function AppMatchFieldsValidator(
  firstFieldName: string,
  secondFieldName: string
): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const firstField = control.get(firstFieldName);
    const secondField = control.get(secondFieldName);

    // only validate if both fields have been touched
    if (firstField.pristine || secondField.pristine) {
      return null;
    }
    if (firstField.value === secondField.value) {
      return null;
    }
    return { ocMatchFields: true };
  };
}
