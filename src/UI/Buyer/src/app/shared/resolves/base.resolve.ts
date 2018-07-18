import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { BaseResolveService } from '@app/shared/services/base-resolve/base-resolve.service';


@Injectable()
export class BaseResolve implements Resolve<any> {
  constructor(
    private baseResolveService: BaseResolveService,
  ) { }

  resolve() {
    return this.baseResolveService.setUser();
  }
}
