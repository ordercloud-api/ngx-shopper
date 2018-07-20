import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { InjectionToken, DebugElement } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { of, BehaviorSubject } from 'rxjs';

import { LoginComponent } from '@app/auth/containers/login/login.component';
import { applicationConfiguration, AppConfig } from '@app/config/app.config';

import { Configuration, AuthService, TokenService } from '@ordercloud/angular-sdk';
import { CookieModule } from 'ngx-cookie';
import { AppAuthService } from '@app/auth';
import { AppErrorHandler } from '@app/config/error-handling.config';
import { AppStateService } from '@app/shared';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let debugElement: DebugElement;

  const router = { navigateByUrl: jasmine.createSpy('navigateByUrl') };
  const ocTokenService = { SetAccess: jasmine.createSpy('SetAccess'), SetRefresh: jasmine.createSpy('Refresh') };
  const response = { access_token: '123456', refresh_token: 'refresh123456' };
  const ocAuthService = { Login: jasmine.createSpy('Login').and.returnValue(of(response)) };
  const appAuthService = { setRememberStatus: jasmine.createSpy('setRememberStatus') };
  const appStateService = { isAnonSubject: new BehaviorSubject(false) };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        ReactiveFormsModule,
        CookieModule.forRoot(),
        HttpClientModule
      ],
      providers: [
        AppErrorHandler,
        { provide: AppStateService, useValue: appStateService },
        { provide: AppAuthService, useValue: appAuthService },
        { provide: Router, useValue: router },
        { provide: TokenService, useValue: ocTokenService },
        { provide: AuthService, useValue: ocAuthService },
        { provide: applicationConfiguration, useValue: new InjectionToken<AppConfig>('app.config') },
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    debugElement = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  describe('ngOnInit', () => {
    beforeEach(() => {
      component.ngOnInit();
    });
    it('should set the form values to empty strings', () => {
      expect(component.form.value).toEqual({
        username: '',
        password: '',
        rememberMe: false
      });
    });
  });
  describe('onSubmit', () => {
    beforeEach(() => {
      component['appConfig'].clientID = 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx';
      component['appConfig'].scope = ['testScope'];
    });
    it('should call the AuthService Login method, TokenService SetAccess method, and route to home', () => {
      component.onSubmit();
      expect(ocAuthService.Login).toHaveBeenCalledWith('', '', 'xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx', ['testScope']);
      expect(ocTokenService.SetAccess).toHaveBeenCalledWith(response.access_token);
      expect(router.navigateByUrl).toHaveBeenCalledWith('/home');
    });

    it('should call set refresh token and set rememberStatus if rememberMe is true', () => {
      component.form.controls['rememberMe'].setValue(true);
      component.onSubmit();
      expect(ocTokenService.SetRefresh).toHaveBeenCalledWith('refresh123456');
      expect(appAuthService.setRememberStatus).toHaveBeenCalledWith(true);
    });
  });

  describe('showRegisterLink', () => {
    it('should be false when user is anonymous', () => {
      appStateService.isAnonSubject.next(true);
      expect(component.showRegisterLink()).toEqual(false);
    });
  });
});
