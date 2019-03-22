import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { BaseResolveService } from '@app-buyer/shared/services/base-resolve/base-resolve.service';

@Injectable({
  providedIn: 'root',
})
export class BaseResolve implements Resolve<any> {
  constructor(private baseResolveService: BaseResolveService) {}

  resolve() {
    return this.baseResolveService.setUser();
  }
}
