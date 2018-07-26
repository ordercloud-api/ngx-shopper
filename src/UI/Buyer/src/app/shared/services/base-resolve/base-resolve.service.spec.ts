import { TestBed, inject } from '@angular/core/testing';
import { HttpClient, HttpHandler } from '@angular/common/http';

import { BaseResolveService } from '@app-buyer/shared/services/base-resolve/base-resolve.service';
import { AppStateService, OcLineItemService } from '@app-buyer/shared';
import { AppAuthService } from '@app-buyer/auth/services/app-auth.service';
import { applicationConfiguration, AppConfig } from '@app-buyer/config/app.config';

import {
  AuthService,
  MeService,
  OrderService,
  TokenService,
  Configuration,
  LineItemService,
  SupplierAddressService,
  SupplierService
} from '@ordercloud/angular-sdk';
import { CookieModule } from 'ngx-cookie';
import { RouterTestingModule } from '@angular/router/testing';
import { AppErrorHandler } from '@app-buyer/config/error-handling.config';

describe('BaseResolveService', () => {
  beforeEach(() => {
    const authService = { isUserAnon: jasmine.createSpy('isUserAnon') };
    const appConfig = { appname: 'mgr-dev' };
    TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        CookieModule.forRoot()
      ],
      providers: [
        BaseResolveService,
        AppStateService,
        { provide: AuthService, useValue: authService },
        AppAuthService,
        AppErrorHandler,
        MeService,
        OrderService,
        TokenService,
        HttpClient,
        HttpHandler,
        OcLineItemService,
        LineItemService,
        SupplierService,
        SupplierAddressService,
        { provide: Configuration, useValue: new Configuration() },
        { provide: applicationConfiguration, useValue: appConfig }
      ],

    });
  });

  it('should be created', inject([BaseResolveService], (service: BaseResolveService) => {
    expect(service).toBeTruthy();
  }));
});
