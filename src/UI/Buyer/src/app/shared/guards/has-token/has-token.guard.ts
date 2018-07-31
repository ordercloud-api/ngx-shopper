import { Injectable, Inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { OcTokenService } from '@ordercloud/angular-sdk';
import * as jwtDecode from 'jwt-decode';
import { DecodedOrderCloudToken } from '@app-buyer/shared';
import {
  applicationConfiguration,
  AppConfig,
} from '@app-buyer/config/app.config';
import { AppAuthService } from '@app-buyer/auth/services/app-auth.service';
import { of, Observable } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';
import { AppStateService } from '@app-buyer/shared/services/app-state/app-state.service';

@Injectable()
export class HasTokenGuard implements CanActivate {
  constructor(
    private ocTokenService: OcTokenService,
    private router: Router,
    private appAuthService: AppAuthService,
    private appStateService: AppStateService,
    @Inject(applicationConfiguration) private appConfig: AppConfig
  ) {}
  canActivate(): Observable<boolean> {
    /**
     * very simple test to make sure a token exists,
     * can be parsed and has a valid expiration time
     *
     * shouldn't be depended on for actual token validation.
     * if the token is actually not valid it will fail on a call
     * and the refresh-token interceptor will handle it correctly
     */
    const isAccessTokenValid = this.isTokenValid();
    const refreshTokenExists =
      this.ocTokenService.GetRefresh() &&
      this.appAuthService.getRememberStatus();
    if (!isAccessTokenValid && refreshTokenExists) {
      return this.appAuthService.refresh().pipe(map(() => true));
    }

    // send profiled users to login to get new token
    if (!isAccessTokenValid && !this.appConfig.anonymousShoppingEnabled) {
      this.router.navigate(['/login']);
      return of(false);
    }
    // get new anonymous token and then let them continue
    if (!isAccessTokenValid && this.appConfig.anonymousShoppingEnabled) {
      return this.appAuthService.authAnonymous().pipe(
        flatMap(() => {
          this.appStateService.isLoggedIn.next(true);
          return of(true);
        })
      );
    }
    return of(isAccessTokenValid);
  }

  private isTokenValid(): boolean {
    const token = this.ocTokenService.GetAccess();

    if (!token) {
      return false;
    }

    let decodedToken: DecodedOrderCloudToken;
    try {
      decodedToken = jwtDecode(token);
    } catch (e) {
      decodedToken = null;
    }
    if (!decodedToken) {
      return false;
    }

    const expiresIn = decodedToken.exp * 1000;
    return Date.now() < expiresIn;
  }
}
