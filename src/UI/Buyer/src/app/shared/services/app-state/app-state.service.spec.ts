import { TestBed, inject } from '@angular/core/testing';

import { AppStateService } from '@app/shared/services/app-state/app-state.service';

describe('AppStateService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppStateService]
    });
  });

  it('should be created', inject([AppStateService], (service: AppStateService) => {
    expect(service).toBeTruthy();
  }));
});
