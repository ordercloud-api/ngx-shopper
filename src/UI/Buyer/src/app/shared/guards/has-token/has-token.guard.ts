import { Injectable, Inject } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { TokenService } from '@ordercloud/angular-sdk';
import * as jwtDecode from 'jwt-decode';
import { DecodedOrderCloudToken } from '@app/shared';
import { applicationConfiguration, AppConfig } from '@app/config/app.config';
import { AppAuthService } from '@app/auth/services/app-auth.service';
import { of, Observable } from 'rxjs';
import { flatMap, map } from 'rxjs/operators';

@Injectable()
export class HasTokenGuard implements CanActivate {
  constructor(
    private tokenService: TokenService,
    private router: Router,
    private appAuthService: AppAuthService,
    @Inject(applicationConfiguration) private appConfig: AppConfig
  ) { }
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
    const refreshTokenExists = this.tokenService.GetRefresh() && this.appAuthService.getRememberStatus();

    if (!isAccessTokenValid && refreshTokenExists) {
      return this.appAuthService.refresh().pipe(map(() => true));
    }

    // send profiled users to login to get new token
    if (!isAccessTokenValid && !this.appConfig.anonymousShoppingEnabled) {
      this.router.navigate(['/login']);
    }
    // get new anonymous token and then let them continue
    if (!isAccessTokenValid && this.appConfig.anonymousShoppingEnabled) {
      return this.appAuthService.authAnonymous()
        .pipe(
          flatMap(() => {
            return of(true);
          })
        );
    }
    return of(isAccessTokenValid);
  }

  private isTokenValid(): boolean {
    const token = this.tokenService.GetAccess();

    if (!token) { return false; }

    let decodedToken: DecodedOrderCloudToken;
    try {
      decodedToken = jwtDecode(token);
    } catch (e) {
      decodedToken = null;
    }
    if (!decodedToken) { return false; }

    const expiresIn = decodedToken.exp * 1000;
    return Date.now() < expiresIn;
  }
}
