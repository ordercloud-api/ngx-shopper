import { TestBed } from '@angular/core/testing';
import { IsProfiledUserGuard } from './is-profiled-user.guard';

describe('IsLoggedInGuard', () => {
  const firstIsAnonUserVal = true;
  const secondIsAnonUserVal = false;
  let service: IsProfiledUserGuard;
  const appAuthService = {
    isUserAnon: jasmine
      .createSpy('isUserAnon')
      .and.returnValues(firstIsAnonUserVal, secondIsAnonUserVal),
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        IsProfiledUserGuard,
        { provide: appAuthService, useValue: appAuthService },
      ],
    });
    service = TestBed.get(IsProfiledUserGuard);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return true if user is anonymous', () => {
    expect(service.canActivate()).toBe(!firstIsAnonUserVal);
    expect(service.canActivate()).toBe(!secondIsAnonUserVal);
  });
});
