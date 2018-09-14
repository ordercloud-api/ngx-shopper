import { Injectable } from '@angular/core';
import { FormControl, FormGroup, AbstractControl } from '@angular/forms';

@Injectable()
export class AppFormErrorService {
  displayFormErrors(form: FormGroup) {
    Object.keys(form.controls).forEach((key) => {
      form.get(key).markAsDirty();
    });
  }

  hasValidEmailError(input: FormControl | AbstractControl): boolean {
    return (
      (input.hasError('required') || input.hasError('email')) && input.dirty
    );
  }

  hasPasswordMismatchError(form: FormGroup) {
    return form.hasError('ocMatchFields');
  }

  hasRequiredError(controlName: string, form: FormGroup) {
    return (
      form.get(controlName).hasError('required') && form.get(controlName).dirty
    );
  }

  hasPatternError(controlName: string, form: FormGroup) {
    return (
      form.get(controlName).hasError('pattern') && form.get(controlName).dirty
    );
  }

  hasStrongPasswordError(controlName: string, form: FormGroup) {
    return form.get(controlName).hasError('strongPassword');
  }

  hasMinLengthError(controlName: string, form: FormGroup) {
    return (
      form.get(controlName).hasError('minlength') && form.get(controlName).dirty
    );
  }
}
