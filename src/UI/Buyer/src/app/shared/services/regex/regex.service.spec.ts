import { TestBed, inject } from '@angular/core/testing';

import { RegexService } from './regex.service';

describe('RegexService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [],
    });
  });

  it('should be created', inject([RegexService], (service: RegexService) => {
    expect(service).toBeTruthy();
  }));
});
