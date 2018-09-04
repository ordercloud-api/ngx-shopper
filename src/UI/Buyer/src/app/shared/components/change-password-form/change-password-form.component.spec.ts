import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChangePasswordFormComponent } from './change-password-form.component';
import { AppFormErrorService } from '@app-buyer/shared/services/form-error/form-error.service';
import { ReactiveFormsModule } from '@angular/forms';

describe('ChangePasswordFormComponent', () => {
  let component: ChangePasswordFormComponent;
  let fixture: ComponentFixture<ChangePasswordFormComponent>;
  const formErrorService = {
    displayFormErrors: jasmine.createSpy('displayFormErrors'),
    hasRequiredError: jasmine.createSpy('hasRequiredError'),
    hasPasswordMismatchError: jasmine.createSpy('hasPasswordMismatchError'),
    hasPatternError: jasmine.createSpy('hasPatternError'),
    hasMinLengthError: jasmine.createSpy('hasMinLengthError'),
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ChangePasswordFormComponent],
      providers: [{ provide: AppFormErrorService, useValue: formErrorService }],
      imports: [ReactiveFormsModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChangePasswordFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      spyOn(component, 'setForm');
      component.ngOnInit();
    });
    it('should call setForm', () => {
      expect(component.setForm).toHaveBeenCalled();
    });
  });

  describe('setForm', () => {
    it('should initialize the form', () => {
      component.setForm();
      expect(component.form.value).toEqual({
        currentPassword: '',
        newPassword: '',
        confirmNewPassword: '',
      });
    });
  });

  describe('updatePassword', () => {
    beforeEach(() => {
      spyOn(component.changePassword, 'emit');
      spyOn(component.form, 'reset');
    });
    afterEach(() => {
      formErrorService.displayFormErrors.calls.reset();
    });
    describe('when form is invalid', () => {
      beforeEach(() => {
        component.form.controls['newPassword'].setValue('blah'); // make form invalid
        component.updatePassword();
      });
      it('should display form errors if form is invalid', () => {
        expect(formErrorService.displayFormErrors).toHaveBeenCalled();
      });
      it('should not emit changePassword event if form is invalid', () => {
        expect(component.changePassword.emit).not.toHaveBeenCalled();
      });
    });
    describe('when form is valid', () => {
      beforeEach(() => {
        // set valid form
        const controls = component.form.controls;
        controls.currentPassword.setValue('oldPassword');
        controls.newPassword.setValue('fails345');
        controls.confirmNewPassword.setValue('fails345');
        component.updatePassword();
      });
      it('should not display form errors', () => {
        expect(formErrorService.displayFormErrors).not.toHaveBeenCalled();
      });
      it('should emit changePassword event', () => {
        expect(component.changePassword.emit).toHaveBeenCalledWith({
          currentPassword: 'oldPassword',
          newPassword: 'fails345',
        });
      });
      it('should reset the form', () => {
        expect(component.form.reset).toHaveBeenCalled();
      });
    });

    describe('new password validation', () => {
      beforeEach(() => {
        component.form.controls.currentPassword.setValue('valid password');
      })
      it('should be valid when there are > 8 characters, one number, one letter', () => {
        component.form.controls.newPassword.setValue('fails345');
        component.form.controls.confirmNewPassword.setValue('fails345');
      })
      it('should be invalid if there are fewer than 8 characters', () => {
        component.form.controls.newPassword.setValue('fails345');
        component.form.controls.confirmNewPassword.setValue('fails345');
      })
    })
  });
});
