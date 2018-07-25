import { TestBed, inject } from '@angular/core/testing';

import { FavoriteProductsService } from '@app-buyer/shared/services/favorite-products/favorite-products.service';

describe('FavoriteProductsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FavoriteProductsService]
    });
  });

  it('should be created', inject([FavoriteProductsService], (service: FavoriteProductsService) => {
    expect(service).toBeTruthy();
  }));
});
