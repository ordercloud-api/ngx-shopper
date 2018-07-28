import { TestBed, inject, async } from '@angular/core/testing';

import { OcMeService } from '@ordercloud/angular-sdk';
import { of } from 'rxjs';
import { FavoriteProductsService } from '@app-buyer/shared/services/favorites/favorites.service';

describe('FavoriteProductsService', () => {
  const meService = {
    Get: jasmine.createSpy('Get').and.returnValue(of({})),
    Patch: jasmine.createSpy('Patch').and.returnValue(of({ xp: { FavoriteProducts: []} }))
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        FavoriteProductsService,
        { provide: OcMeService, useValue: meService }
      ]
    });
  }));

  it('should be created', inject([FavoriteProductsService], (service: FavoriteProductsService) => {
    expect(service).toBeTruthy();
  }));

  it('isProductFav should return true for a favorite', inject([FavoriteProductsService], (service: FavoriteProductsService) => {
    service.favorites = ['a', 'b', 'c'];
    expect(service.isFavorite({ ID: 'a' })).toEqual(true);
  }));

  it('isProductFav should return false for a non-favorite', inject([FavoriteProductsService], (service: FavoriteProductsService) => {
    service.favorites = ['a', 'b', 'c'];
    expect(service.isFavorite({ ID: 'd' })).toEqual(false);
  }));

  it('setProductAsFav should remove fav correctly', inject([FavoriteProductsService], (service: FavoriteProductsService) => {
    meService.Patch.calls.reset();
    service.favorites = ['a', 'b'];
    service.setFavoriteValue(false, {ID: 'a' });
    expect(meService.Patch).toHaveBeenCalledWith({ xp: { FavoriteProducts: ['b'] } });
  }));

  it('setProductAsFav should add fav correctly', inject([FavoriteProductsService], (service: FavoriteProductsService) => {
    meService.Patch.calls.reset();
    service.favorites = ['a', 'b'];
    service.setFavoriteValue(true, { ID: 'c' });
    expect(meService.Patch).toHaveBeenCalledWith({ xp: { FavoriteProducts: ['a', 'b', 'c'] } });
  }));
});
