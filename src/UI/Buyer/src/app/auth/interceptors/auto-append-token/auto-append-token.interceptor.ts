import { Injectable, Inject } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { TokenService } from '@ordercloud/angular-sdk';
import { applicationConfiguration, AppConfig } from '@app-buyer/config/app.config';

/**
 * automatically append token to the authorization header
 * required to interact with middleware layer
 */
@Injectable()
export class AutoAppendTokenInterceptor implements HttpInterceptor {

  constructor(
    private tokenService: TokenService,
    @Inject(applicationConfiguration) private appConfig: AppConfig
  ) { }
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (request.url.includes(this.appConfig.middlewareUrl)) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${this.tokenService.GetAccess()}`
        }
      });
    }
    return next.handle(request);
  }
}
