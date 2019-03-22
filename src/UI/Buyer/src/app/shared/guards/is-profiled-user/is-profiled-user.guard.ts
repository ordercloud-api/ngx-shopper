import { Injectable } from '@angular/core';
import { CanActivate } from '@angular/router';

import { AppStateService } from '@app-buyer/shared/services/app-state/app-state.service';

@Injectable({
  providedIn: 'root',
})
export class IsProfiledUserGuard implements CanActivate {
  constructor(private appStateService: AppStateService) {}

  canActivate(): boolean {
    return !this.appStateService.isAnonSubject.value;
  }
}
