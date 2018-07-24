import { Injectable, Inject } from '@angular/core';
import { Observable, throwError, of, BehaviorSubject } from 'rxjs';
import { tap, catchError, finalize, map } from 'rxjs/operators';
import { Router } from '@angular/router';

// 3rd party
import { TokenService, AuthService } from '@ordercloud/angular-sdk';
import { applicationConfiguration, AppConfig } from '@app-buyer/config/app.config';
import { CookieService } from 'ngx-cookie';
import { keys as _keys } from 'lodash';
import { AppErrorHandler } from '@app-buyer/config/error-handling.config';
import * as jwtDecode from 'jwt-decode';
import { isUndefined as _isUndefined } from 'lodash';


export const TokenRefreshAttemptNotPossible = 'Token refresh attempt not possible';
@Injectable()
export class AppAuthService {
    private rememberMeCookieName = `${this.appConfig.appname.replace(/ /g, '_').toLowerCase()}_rememberMe`;
    fetchingRefreshToken = false;
    failedRefreshAttempt = false;
    refreshToken: BehaviorSubject<string>;

    constructor(
        private tokenService: TokenService,
        private authService: AuthService,
        private cookieService: CookieService,
        private router: Router,
        private appErrorHandler: AppErrorHandler,
        @Inject(applicationConfiguration) private appConfig: AppConfig,
    ) {
        this.refreshToken = new BehaviorSubject<string>('');
    }

    refresh(): Observable<void> {
        this.fetchingRefreshToken = true;
        return this.fetchRefreshToken()
            .pipe(
                tap(token => {
                    this.tokenService.SetAccess(token);
                    this.refreshToken.next(token);
                }),
                catchError(error => {
                    if (this.tokenService.GetAccess() && error === TokenRefreshAttemptNotPossible) {
                        this.appErrorHandler.displayError({ message: error });
                    }
                    // ignore new refresh attempts if a refresh
                    // attempt failed within the last 3 seconds
                    this.failedRefreshAttempt = true;
                    setTimeout(() => {
                        this.failedRefreshAttempt = false;
                    }, 3000);
                    return this.logout();
                }),
                finalize((() => {
                    this.fetchingRefreshToken = false;
                }))
            );
    }

    fetchToken(): Observable<string> {
        const accessToken = this.tokenService.GetAccess();
        if (accessToken) {
            return of(accessToken);
        }
        return this.fetchRefreshToken();
    }

    fetchRefreshToken(): Observable<string> {
        const refreshToken = this.tokenService.GetRefresh();
        if (refreshToken) {
            return this.authService.RefreshToken(refreshToken, this.appConfig.clientID)
                .pipe(
                    map(authResponse => authResponse.access_token),
                    tap(token => this.tokenService.SetAccess(token)),
                    catchError(error => {
                        if (this.appConfig.anonymousShoppingEnabled) {
                            return this.authAnonymous();
                        } else {
                            throwError(error);
                        }
                    })
                );
        }

        if (this.appConfig.anonymousShoppingEnabled) {
            return this.authAnonymous();
        }

        throwError(TokenRefreshAttemptNotPossible);
    }

    logout(): Observable<any> {
        const cookiePrefix = this.appConfig.appname.replace(/ /g, '_').toLowerCase();
        const appCookieNames = _keys(this.cookieService.getAll());
        appCookieNames.forEach(cookieName => {
            if (cookieName.indexOf(cookiePrefix) > -1) {
                this.cookieService.remove(cookieName);
            }
        });
        return of(this.router.navigate(['/login']));
    }

    authAnonymous(): Observable<string> {
        return this.authService.Anonymous(this.appConfig.clientID, this.appConfig.scope)
            .pipe(
                map(authResponse => authResponse.access_token),
                tap((token => this.tokenService.SetAccess(token))),
                catchError(ex => {
                    this.appErrorHandler.displayError(ex);
                    return this.logout();
                })
            );
    }

    isUserAnon(): boolean {
        const anonOrderID = jwtDecode(this.tokenService.GetAccess()).orderid;
        return !_isUndefined(anonOrderID);
    }

    setRememberStatus(status: boolean): void {
        this.cookieService.putObject(this.rememberMeCookieName, { status: status });
    }

    getRememberStatus(): boolean {
        const rememberMe = <{ status: string }>this.cookieService.getObject(this.rememberMeCookieName);
        return !!(rememberMe && rememberMe.status);
    }
}
