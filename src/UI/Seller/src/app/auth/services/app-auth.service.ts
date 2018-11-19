import { Injectable, Inject } from '@angular/core';
import { Observable, throwError, of, BehaviorSubject } from 'rxjs';
import { tap, catchError, finalize, map } from 'rxjs/operators';
import { Router } from '@angular/router';

// 3rd party
import { OcTokenService, OcAuthService } from '@ordercloud/angular-sdk';
import {
  applicationConfiguration,
  AppConfig,
} from '@app-seller/config/app.config';
import { CookieService } from 'ngx-cookie';
import { keys as _keys } from 'lodash';
import { isUndefined as _isUndefined } from 'lodash';
import { AppStateService } from '@app-seller/shared/services/app-state/app-state.service';

export const TokenRefreshAttemptNotPossible =
  'Token refresh attempt not possible';
@Injectable({
  providedIn: 'root',
})
export class AppAuthService {
  private rememberMeCookieName = `${this.appConfig.appname
    .replace(/ /g, '_')
    .toLowerCase()}_rememberMe`;
  fetchingRefreshToken = false;
  failedRefreshAttempt = false;
  refreshToken: BehaviorSubject<string>;

  constructor(
    private ocTokenService: OcTokenService,
    private ocAuthService: OcAuthService,
    private cookieService: CookieService,
    private router: Router,
    private appStateService: AppStateService,
    @Inject(applicationConfiguration) private appConfig: AppConfig
  ) {
    this.refreshToken = new BehaviorSubject<string>('');
  }

  refresh(): Observable<void> {
    this.fetchingRefreshToken = true;
    return this.fetchRefreshToken().pipe(
      tap((token) => {
        this.ocTokenService.SetAccess(token);
        this.refreshToken.next(token);
        this.appStateService.isLoggedIn.next(true);
      }),
      catchError(() => {
        // ignore new refresh attempts if a refresh
        // attempt failed within the last 3 seconds
        this.failedRefreshAttempt = true;
        setTimeout(() => {
          this.failedRefreshAttempt = false;
        }, 3000);
        return this.logout();
      }),
      finalize(() => {
        this.fetchingRefreshToken = false;
      })
    );
  }

  fetchToken(): Observable<string> {
    const accessToken = this.ocTokenService.GetAccess();
    if (accessToken) {
      return of(accessToken);
    }
    return this.fetchRefreshToken();
  }

  fetchRefreshToken(): Observable<string> {
    const refreshToken = this.ocTokenService.GetRefresh();
    if (refreshToken) {
      return this.ocAuthService
        .RefreshToken(refreshToken, this.appConfig.clientID)
        .pipe(
          map((authResponse) => authResponse.access_token),
          tap((token) => this.ocTokenService.SetAccess(token)),
          catchError((error) => {
            return throwError(error);
          })
        );
    }
    throwError(TokenRefreshAttemptNotPossible);
  }

  logout(): Observable<any> {
    const cookiePrefix = this.appConfig.appname
      .replace(/ /g, '_')
      .toLowerCase();
    const appCookieNames = _keys(this.cookieService.getAll());
    appCookieNames.forEach((cookieName) => {
      if (cookieName.indexOf(cookiePrefix) > -1) {
        this.cookieService.remove(cookieName);
      }
    });
    this.appStateService.isLoggedIn.next(false);
    return of(this.router.navigate(['/login']));
  }

  setRememberStatus(status: boolean): void {
    this.cookieService.putObject(this.rememberMeCookieName, { status: status });
  }

  getRememberStatus(): boolean {
    const rememberMe = <{ status: string }>(
      this.cookieService.getObject(this.rememberMeCookieName)
    );
    return !!(rememberMe && rememberMe.status);
  }
}
