import { TestBed } from '@angular/core/testing';
import { IsProfiledUserGuard } from './is-profiled-user.guard';
import { BehaviorSubject } from 'rxjs';
import { AppStateService } from '@app-buyer/shared/services/app-state/app-state.service';

describe('IsProfiledUserGuard', () => {
  let service: IsProfiledUserGuard;
  const appStateService = {
    isAnonSubject: new BehaviorSubject(true),
  };
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [{ provide: AppStateService, useValue: appStateService }],
    });
    service = TestBed.get(IsProfiledUserGuard);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return false if user is not profiled', () => {
    appStateService.isAnonSubject.next(true);
    expect(service.canActivate()).toBe(false);
  });
  it('should return true if user is profiled', () => {
    appStateService.isAnonSubject.next(false);
    expect(service.canActivate()).toBe(true);
  });
});
