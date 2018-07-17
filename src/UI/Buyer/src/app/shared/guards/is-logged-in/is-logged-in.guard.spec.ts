import { TestBed, inject } from '@angular/core/testing';

import { IsLoggedInGuard } from '@app/shared/guards/is-logged-in/is-logged-in.guard';
import { AppAuthService } from '@app/auth';

describe('IsLoggedInGuard', () => {
  const firstIsAnonUserVal = true;
  const secondIsAnonUserVal = false;
  let service: IsLoggedInGuard;
  const appAuthService = { isUserAnon: jasmine.createSpy('isUserAnon').and.returnValues(firstIsAnonUserVal, secondIsAnonUserVal) };
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
      ],
      providers: [
        IsLoggedInGuard,
        { provide: AppAuthService, useValue: appAuthService },
      ]
    });
    service = TestBed.get(IsLoggedInGuard);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return true if user is anonymous', () => {
    expect(service.canActivate()).toBe(!firstIsAnonUserVal);
    expect(service.canActivate()).toBe(!secondIsAnonUserVal);
  });

});
