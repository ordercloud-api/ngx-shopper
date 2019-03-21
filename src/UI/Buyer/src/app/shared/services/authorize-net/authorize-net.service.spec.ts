import { TestBed, inject, async } from '@angular/core/testing';

import { AuthorizeNetService } from '@app-buyer/shared/services/authorize-net/authorize-net.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import {
  OcTokenService,
  OcOrderService,
  OcPaymentService,
} from '@ordercloud/angular-sdk';
import {
  applicationConfiguration,
  AppConfig,
} from '@app-buyer/config/app.config';
import { InjectionToken } from '@angular/core';

describe('Authorize.NetService', () => {
  const tokenService = {
    GetAccess: jasmine.createSpy('GetAccess').and.returnValue({}),
  };
  const payementService = {
    Delete: jasmine.createSpy('Delete').and.returnValue({}),
  };
  const orderService = {
    Patch: jasmine.createSpy('Patch').and.returnValue({}),
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: OcTokenService, useValue: tokenService },
        { provide: OcPaymentService, useValue: payementService },
        { provide: OcOrderService, useValue: orderService },
        {
          provide: applicationConfiguration,
          useValue: new InjectionToken<AppConfig>('app.config'),
        },
      ],
      imports: [HttpClientTestingModule],
    });
  }));

  it('should be created', inject(
    [AuthorizeNetService],
    (service: AuthorizeNetService) => {
      expect(service).toBeTruthy();
    }
  ));

  it('getCardType should match visa', inject(
    [AuthorizeNetService],
    (service: AuthorizeNetService) => {
      expect(service.getCardType('4000000000000000')).toEqual('Visa');
    }
  ));
  it('getCardType should match Master Card', inject(
    [AuthorizeNetService],
    (service: AuthorizeNetService) => {
      expect(service.getCardType('5100000000000000')).toEqual('MasterCard');
    }
  ));
  it('getCardType should match Discover', inject(
    [AuthorizeNetService],
    (service: AuthorizeNetService) => {
      expect(service.getCardType('6011000000000000')).toEqual('Discover');
    }
  ));
  it('getCardType should not error on undefined', inject(
    [AuthorizeNetService],
    (service: AuthorizeNetService) => {
      expect(service.getCardType(undefined)).toEqual(null);
    }
  ));
  it('getCardType should not match bad number', inject(
    [AuthorizeNetService],
    (service: AuthorizeNetService) => {
      expect(() => service.getCardType('hello')).toThrow(
        new Error('Card number does not match accepted credit card companies')
      );
    }
  ));
});
