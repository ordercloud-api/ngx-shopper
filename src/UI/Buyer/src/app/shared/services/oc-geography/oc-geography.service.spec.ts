import { TestBed, inject } from '@angular/core/testing';

import { OcGeographyService } from '@app/shared/services/oc-geography/oc-geography.service';

describe('OcGeographyService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [OcGeographyService]
    });
  });

  it('should be created', inject([OcGeographyService], (service: OcGeographyService) => {
    expect(service).toBeTruthy();
  }));
});
