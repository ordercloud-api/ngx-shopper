import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { InjectionToken } from '@angular/core';
import { of } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';

import { ResetPasswordComponent } from '@app-seller/auth/containers/reset-password/reset-password.component';

import { OcPasswordResetService } from '@ordercloud/angular-sdk';
import { CookieModule } from 'ngx-cookie';
import { ToastrService } from 'ngx-toastr';
import { AppFormErrorService } from '@app-seller/shared';
import {
  applicationConfiguration,
  AppConfig,
} from '@app-seller/config/app.config';

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
    const formbuilder = new FormBuilder();
    beforeEach(() => {
      component.ngOnInit();
    });
    it('should set the form values to empty strings, and the local vars to the matching query params', () => {
      expect(component.resetPasswordForm.value).toEqual({
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
      component['appConfig'].clientID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

      component.onSubmit();
    });
    it('should call the PasswordService ResetPasswordByVerificationCode method, Toastr success method, and route to login', () => {
      expect(
        ocPasswordService.ResetPasswordByVerificationCode
      ).toHaveBeenCalledWith('pwverificationcode', {
        ClientID: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
        Password: component.resetPasswordForm.value.password,
        Username: component.username,
      });
      expect(toastrService.success).toHaveBeenCalledWith(
        'Password Reset Successfully'
      );
      expect(router.navigateByUrl).toHaveBeenCalledWith('/login');
    });
  });

  describe('passwordMismatchError', () => {
    beforeEach(() => {
      component['passwordMismatchError']();
    });
    it('should call formErrorService.hasRequiredError', () => {
      expect(formErrorService.hasPasswordMismatchError).toHaveBeenCalledWith(
        component.resetPasswordForm
      );
    });
  });
});
