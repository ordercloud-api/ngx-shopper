import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

import { AppAuthService } from '@app/auth/services/app-auth.service';

@Injectable()
export class IsLoggedInGuard implements CanActivate {

  constructor(
    private appAuthService: AppAuthService,
  ) { }

  canActivate(): boolean {
    return !this.appAuthService.isUserAnon();
  }
}
