import { TestBed, inject } from '@angular/core/testing';

import { GeolocatorService } from './geolocator.service';
import { CookieModule } from 'ngx-cookie';

describe('GeolocatorService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        CookieModule.forRoot()
      ],
      providers: [GeolocatorService]
    });
  });

  it('should be created', inject([GeolocatorService], (service: GeolocatorService) => {
    expect(service).toBeTruthy();
  }));
});
