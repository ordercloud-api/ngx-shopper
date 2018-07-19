import { TestBed, inject } from '@angular/core/testing';
import { applicationConfiguration } from '@app/config/app.config';

import {
    AuthService,
    TokenService,
    Configuration,
} from '@ordercloud/angular-sdk';
import { CookieModule, CookieService } from 'ngx-cookie';
import { RouterTestingModule } from '@angular/router/testing';
import { AppErrorHandler } from '@app/config/error-handling.config';
import { AppAuthService } from '@app/auth/services/app-auth.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of, throwError } from 'rxjs';
import { Router } from '@angular/router';

describe('AppAuthService', () => {
    const mockCookieResponse = { 'mgr-test_cookieOne': 'cookieone', 'mgr-test_cookieTwo': 'cookietwo', 'otherCookie': 'othercookie' };
    const mockRefreshToken = 'mock refresh token';
    const mockToken = 'mock token';
    const mockClientID = 'mockClientID';
    const mockAppName = 'mgr-test';
    const router = { navigate: jasmine.createSpy('navigate') };
    const cookieService = {
        getObject: jasmine.createSpy('getObject').and.returnValue({ status: true }),
        putObject: jasmine.createSpy('putObject'),
        getAll: jasmine.createSpy('getAll').and.returnValue(mockCookieResponse),
        remove: jasmine.createSpy('remove')
    };
    let appAuthService: AppAuthService;
    let authService: AuthService;
    let tokenService: TokenService;
    let appConfig = {
        appname: mockAppName,
        clientID: mockClientID,
        anonymousShoppingEnabled: true,
        scope: ['FullAccess']
    };
    const appErrorHandler = { displayError: jasmine.createSpy('displayError') };
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                RouterTestingModule,
                HttpClientTestingModule,
                CookieModule.forRoot()
            ],
            providers: [
                { provide: Router, useValue: router },
                { provide: CookieService, useValue: cookieService },
                AuthService,
                AppAuthService,
                { provide: AppErrorHandler, useValue: appErrorHandler },
                TokenService,
                { provide: Configuration, useValue: new Configuration() },
                { provide: applicationConfiguration, useValue: appConfig }
            ],
        });
        appConfig = TestBed.get(applicationConfiguration);
        tokenService = TestBed.get(TokenService);
        appAuthService = TestBed.get(AppAuthService);
        authService = TestBed.get(AuthService);
    });

    it('should be created', inject([AppAuthService], (service: AppAuthService) => {
        expect(service).toBeTruthy();
    }));

    describe('refresh', () => {
        describe('on success', () => {
            beforeEach(() => {
                spyOn(appAuthService, 'fetchRefreshToken').and.returnValue(of(mockToken));
                spyOn(appAuthService, 'logout').and.returnValue(of(null));
                spyOn(tokenService, 'SetAccess');
                appAuthService.refresh().subscribe();
            });
            it('should call fetchRefreshToken', () => {
                expect(appAuthService.fetchRefreshToken).toHaveBeenCalled();
            });
            it('should save the retrieved refresh token', () => {
                expect(tokenService.SetAccess).toHaveBeenCalledWith(mockToken);
            });
        });
        describe('on error', () => {
            beforeEach(() => {
                spyOn(tokenService, 'GetAccess').and.returnValue(mockToken);
                spyOn(appAuthService, 'fetchRefreshToken').and.returnValue(throwError('Token refresh attempt not possible'));
                appAuthService.refresh().subscribe();
            });
            it('should check if the user had a token before failing call', () => {
                expect(tokenService.GetAccess).toHaveBeenCalled();
            });
            it('should display error message if token existed before failing call', () => {
                expect(appErrorHandler.displayError).toHaveBeenCalledWith({ message: 'Token refresh attempt not possible' });
            });
            it('should set failedRefreshAttempt to true', () => {
                expect(appAuthService.failedRefreshAttempt).toBe(true);
            });
        });
    });

    describe('fetchToken', () => {
        beforeEach(() => {
            spyOn(appAuthService, 'fetchRefreshToken');
        });
        it('should return access token if it is available', () => {
            spyOn(tokenService, 'GetAccess').and.returnValue('mockToken');
            appAuthService.fetchToken();
            expect(appAuthService.fetchRefreshToken).not.toHaveBeenCalled();
        });
        it('should call fetchRefresh token if no access token is available', () => {
            spyOn(tokenService, 'GetAccess').and.returnValue(null);
            appAuthService.fetchToken();
            expect(appAuthService.fetchRefreshToken).toHaveBeenCalled();
        });
    });

    describe('fetchRefreshToken', () => {
        describe('and has refresh token', () => {
            beforeEach(() => {
                spyOn(tokenService, 'GetRefresh').and.returnValue(mockRefreshToken);
            });
            it('should call authService.RefreshToken', () => {
                spyOn(authService, 'RefreshToken').and.returnValue(of({ access_token: mockToken }));
                appAuthService.fetchRefreshToken();
                expect(authService.RefreshToken).toHaveBeenCalledWith(mockRefreshToken, mockClientID);
            });
            it('should call auth anonymous if refresh failed and user is anonymous', () => {
                spyOn(authService, 'RefreshToken').and.returnValue(throwError(null));
                spyOn(appAuthService, 'authAnonymous').and.returnValue(of(null));
                appConfig.anonymousShoppingEnabled = true;
                appAuthService.fetchRefreshToken().subscribe();
                expect(appAuthService.authAnonymous).toHaveBeenCalled();
            });
        });
        describe('and does not have a refresh token', () => {
            beforeEach(() => {
                spyOn(tokenService, 'GetRefresh').and.returnValue(null);
            });
            it('should attempt to auth anonymous if user is anonymous', () => {
                appConfig.anonymousShoppingEnabled = true;
                spyOn(appAuthService, 'authAnonymous').and.returnValue(of(null));
            });
            it('should throw error if user is not anonymous', () => {
                spyOn(appAuthService, 'authAnonymous').and.returnValue(of(null));
                appConfig.anonymousShoppingEnabled = false;
                expect(() => {
                    appAuthService.fetchRefreshToken().subscribe();
                }).toThrow();
                expect(appAuthService.authAnonymous).not.toHaveBeenCalled();
            });
        });

        describe('logout', () => {
            beforeEach(() => {
                appAuthService.logout();
            });
            it('should clear out cookies that start with appname', () => {
                expect(cookieService.getAll).toHaveBeenCalled();
                expect(cookieService.remove).toHaveBeenCalledWith('mgr-test_cookieOne');
                expect(cookieService.remove).toHaveBeenCalledWith('mgr-test_cookieTwo');
                expect(cookieService.remove).not.toHaveBeenCalledWith('otherCookie');
            });
            it('should navigate user to login page', () => {
                expect(router.navigate).toHaveBeenCalledWith(['/login']);
            });
        });

        describe('authAnonymous', () => {
            beforeEach(() => {
                spyOn(appAuthService, 'logout').and.returnValue(of(null));
            });
            it('should call authService.Anonymous', () => {
                spyOn(authService, 'Anonymous').and.returnValue(of({ access_token: mockToken }));
                appAuthService.authAnonymous().subscribe();
                expect(authService.Anonymous).toHaveBeenCalledWith(mockClientID, ['FullAccess']);
            });
            it('should display error if authService.Anonymous fails', () => {
                spyOn(authService, 'Anonymous').and.returnValue(throwError('error'));
                appAuthService.authAnonymous().subscribe();
                expect(appErrorHandler.displayError).toHaveBeenCalledWith('error');
            });
            it('should log user out if austhService.Anonymous fails', () => {
                spyOn(authService, 'Anonymous').and.returnValue(throwError('error'));
                appAuthService.authAnonymous().subscribe();
                expect(appAuthService.logout).toHaveBeenCalled();
            });
        });
        describe('isUserAnon', () => {
            // tslint:disable:max-line-length
            const tokenWithOrderId = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c3IiOiJhbm9uX3VzZXIiLCJjaWQiOiI4MDIxODkzNi0zNTBiLTQxMDUtYTFmYy05NjJhZjAyM2Q2NjYiLCJvcmRlcmlkIjoiSVlBSnFOWVVpRVdyTy1Lei1TalpqUSIsInVzcnR5cGUiOiJidXllciIsInJvbGUiOlsiQnV5ZXJSZWFkZXIiLCJNZUFkbWluIiwiTWVDcmVkaXRDYXJkQWRtaW4iLCJNZUFkZHJlc3NBZG1pbiIsIk1lWHBBZG1pbiIsIlBhc3N3b3JkUmVzZXQiLCJTaGlwbWVudFJlYWRlciIsIlNob3BwZXIiLCJBZGRyZXNzUmVhZGVyIl0sImlzcyI6Imh0dHBzOi8vYXV0aC5vcmRlcmNsb3VkLmlvIiwiYXVkIjoiaHR0cHM6Ly9hcGkub3JkZXJjbG91ZC5pbyIsImV4cCI6MTUyNzA5Nzc0MywibmJmIjoxNTI2NDkyOTQzfQ.MBV7dqBq8RXSZZ8vEGidcfH8vSwOR55yHzvAq1w2bLc';
            const tokenWithoutOrderID = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c3IiOiJjaGlwb3RsZWNyaGlzdGlhbiIsImNpZCI6Ijc1NzMwMTc4LWU0MjQtNGM0OS1iM2Q3LTE3Mzg1Nzg0YjE5MSIsInVzcnR5cGUiOiJidXllciIsInJvbGUiOlsiQnV5ZXJSZWFkZXIiLCJDYXRhbG9nUmVhZGVyIiwiTWVBZG1pbiIsIk1lQ3JlZGl0Q2FyZEFkbWluIiwiTWVBZGRyZXNzQWRtaW4iLCJNZVhwQWRtaW4iLCJQYXNzd29yZFJlc2V0IiwiU2hpcG1lbnRSZWFkZXIiLCJTaG9wcGVyIiwiT3JkZXJSZWFkZXIiLCJBZGRyZXNzQWRtaW4iLCJVc2VyR3JvdXBBZG1pbiJdLCJpc3MiOiJodHRwczovL2F1dGgub3JkZXJjbG91ZC5pbyIsImF1ZCI6Imh0dHBzOi8vYXBpLm9yZGVyY2xvdWQuaW8iLCJleHAiOjE1MjY1Mjg3NzQsIm5iZiI6MTUyNjQ5Mjc3NH0.uqh3_yLXTCSpzLxk6B4gbPX0wmQF4JIZTEHRXvPD9r0';
            it('should call tokenService.GetAccess', () => {
                spyOn(tokenService, 'GetAccess').and.returnValue(tokenWithOrderId);
                appAuthService.isUserAnon();
                expect(tokenService.GetAccess).toHaveBeenCalled();
            });
            it('should return true if token has orderid property', () => {
                spyOn(tokenService, 'GetAccess').and.returnValue(tokenWithOrderId);
                const isUserAnon = appAuthService.isUserAnon();
                expect(isUserAnon).toBe(true);
            });
            it('should return false if token does not have orderid property', () => {
                spyOn(tokenService, 'GetAccess').and.returnValue(tokenWithoutOrderID);
                const isUserAnon = appAuthService.isUserAnon();
                expect(isUserAnon).toBe(false);
            });
        });
        describe('setRememberStatus', () => {
            const statusTrue = true;
            beforeEach(() => {
                appAuthService.setRememberStatus(statusTrue);
            });
            it('should store status in cookies', () => {
                expect(cookieService.putObject).toHaveBeenCalledWith('mgr-test_rememberMe', { status: statusTrue });
            });
        });
        describe('getRememberStatus', () => {
            it('should return status stored in cookies', () => {
                const rememberMeStatus = appAuthService.getRememberStatus();
                expect(rememberMeStatus).toBe(true);
            });
        });
    });
});
