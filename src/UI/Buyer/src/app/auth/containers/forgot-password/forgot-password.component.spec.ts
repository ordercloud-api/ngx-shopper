import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { of } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { InjectionToken } from '@angular/core';

import { ForgotPasswordComponent } from './forgot-password.component';
import { applicationConfiguration, AppConfig } from '../../../config/app.config';

import { Configuration, PasswordResetService, TokenService } from '@ordercloud/angular-sdk';
import { CookieModule } from 'ngx-cookie';
import { ToastrService } from 'ngx-toastr';

describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;

  const router = { navigateByUrl: jasmine.createSpy('navigateByUrl') };
  const ocPasswordService = { SendVerificationCode: jasmine.createSpy('SendVerificationCode').and.returnValue(of(true)) };
  const toastrService = { success: jasmine.createSpy('success') };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ForgotPasswordComponent],
      imports: [
        ReactiveFormsModule,
        CookieModule.forRoot(),
        HttpClientModule
      ],
      providers: [
        TokenService,
        { provide: Router, useValue: router },
        { provide: PasswordResetService, useValue: ocPasswordService },
        { provide: Configuration, useValue: new Configuration() },
        { provide: ToastrService, useValue: toastrService },
        { provide: applicationConfiguration, useValue: new InjectionToken<AppConfig>('app.config') }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOnInit', () => {
    const formbuilder = new FormBuilder;
    beforeEach(() => {
      component.ngOnInit();
    });
    it('should set the form values to empty strings', () => {
      expect(component.resetEmailForm.value).toEqual({
        email: ''
      });
    });
  });
  describe('onSubmit', () => {
    beforeEach(() => {
      component['appConfig'].clientID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';

      component.onSubmit();
    });
    it('should call the PasswordService SendVerificationCode method, Toaster success method, and route to login', () => {
      expect(ocPasswordService.SendVerificationCode).toHaveBeenCalledWith({
        Email: '',
        ClientID: 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx',
        URL: 'http://localhost:9876'
      });
      expect(toastrService.success).toHaveBeenCalledWith('Password Reset Email Sent!');
      expect(router.navigateByUrl).toHaveBeenCalledWith('/login');
    });
  });
});
