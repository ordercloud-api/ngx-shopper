import { TestBed, inject } from '@angular/core/testing';

import { AvalaraTaxService } from './avalara-tax.service';

describe('AvalaraTaxService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AvalaraTaxService]
    });
  });

  it('should be created', inject([AvalaraTaxService], (service: AvalaraTaxService) => {
    expect(service).toBeTruthy();
  }));
});
