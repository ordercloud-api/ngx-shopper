import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { InjectionToken } from '@angular/core';
import { of } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';

import { ResetPasswordComponent } from '@app-buyer/auth/containers/reset-password/reset-password.component';
import {
  applicationConfiguration,
  AppConfig,
} from '@app-buyer/config/app.config';

import { OcPasswordResetService } from '@ordercloud/angular-sdk';
import { CookieModule } from 'ngx-cookie';
import { ToastrService } from 'ngx-toastr';
import { AppFormErrorService } from '@app-buyer/shared';

describe('ResetPasswordComponent', () => {
  let component: ResetPasswordComponent;
  let fixture: ComponentFixture<ResetPasswordComponent>;

  const router = { navigateByUrl: jasmine.createSpy('navigateByUrl') };
  const ocPasswordService = {
    ResetPasswordByVerificationCode: jasmine
      .createSpy('ResetPasswordByVerificationCode')
      .and.returnValue(of(true)),
  };
  const toastrService = { success: jasmine.createSpy('success') };
  const activatedRoute = {
    snapshot: { queryParams: { user: 'username', code: 'pwverificationcode' } },
  };
  const formErrorService = {
    hasPasswordMismatchError: jasmine.createSpy('hasPasswordMismatchError'),
    hasRequiredError: jasmine.createSpy('hasRequiredError'),
    hasStrongPasswordError: jasmine.createSpy('hasStrongPasswordError'),
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ResetPasswordComponent],
      imports: [ReactiveFormsModule, CookieModule.forRoot(), HttpClientModule],
      providers: [
        { provide: OcPasswordResetService, useValue: ocPasswordService },
        { provide: Router, useValue: router },
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: ToastrService, useValue: toastrService },
        { provide: AppFormErrorService, useValue: formErrorService },
        {
          provide: applicationConfiguration,
          useValue: new InjectionToken<AppConfig>('app.config'),
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOnInit', () => {
    beforeEach(() => {
      component.ngOnInit();
    });
    it('should set the form values to empty strings, and the local vars to the matching query params', () => {
      expect(component.form.value).toEqual({
        password: '',
        passwordConfirm: '',
      });
      expect(component.username).toEqual(
        activatedRoute.snapshot.queryParams.user
      );
      expect(component.resetCode).toEqual(
        activatedRoute.snapshot.queryParams.code
      );
    });
  });
  describe('onSubmit', () => {
    beforeEach(() => {
      setValidForm();
      component['appConfig'].clientID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
      component.onSubmit();
    });
    it('should call ResetPasswordByVerificationCode', () => {
      expect(
        ocPasswordService.ResetPasswordByVerificationCode
      ).toHaveBeenCalledWith('pwverificationcode', {
        ClientID: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
        Password: component.form.value.password,
        Username: component.username,
      });
    });
    it('should call success toastr', () => {
      expect(toastrService.success).toHaveBeenCalledWith(
        'Password Reset',
        'Success'
      );
    });
    it('should route user to login', () => {
      expect(router.navigateByUrl).toHaveBeenCalledWith('/login');
    });
  });

  function setValidForm() {
    component.form.controls['password'].setValue('fails345');
    component.form.controls['passwordConfirm'].setValue('fails345');
  }

  describe('hasRequiredError', () => {
    beforeEach(() => {
      component['hasRequiredError']('password');
    });
    it('should call formErrorService.hasRequiredError', () => {
      expect(formErrorService.hasRequiredError).toHaveBeenCalledWith(
        'password',
        component.form
      );
    });
  });

  describe('hasPasswordMismatchError', () => {
    beforeEach(() => {
      component['hasPasswordMismatchError']();
    });
    it('should call formErrorService.hasRequiredError', () => {
      expect(formErrorService.hasPasswordMismatchError).toHaveBeenCalledWith(
        component.form
      );
    });
  });

  describe('hasStrongPasswordError', () => {
    beforeEach(() => {
      component['hasStrongPasswordError']('password');
    });
    it('should call formErrorService.hasStrongPasswordError', () => {
      expect(formErrorService.hasStrongPasswordError).toHaveBeenCalledWith(
        'password',
        component.form
      );
    });
  });
});
