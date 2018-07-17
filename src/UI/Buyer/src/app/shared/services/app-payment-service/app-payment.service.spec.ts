import { TestBed, inject } from '@angular/core/testing';

import { AppPaymentService } from '@app/shared/services/app-payment-service/app-payment.service';

describe('AppPaymentServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppPaymentService]
    });
  });

  it('should be created', inject([AppPaymentService], (service: AppPaymentService) => {
    expect(service).toBeTruthy();
  }));
});
