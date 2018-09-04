import { TestBed, inject, async } from '@angular/core/testing';

import { OcMeService, MeUser } from '@ordercloud/angular-sdk';
import { of, BehaviorSubject } from 'rxjs';
import { FavoriteProductsService } from '@app-buyer/shared/services/favorites/favorites.service';
import { AppStateService } from '@app-buyer/shared/services/app-state/app-state.service';

describe('FavoriteProductsService', () => {

  let service;
  const meService = {
    Get: jasmine.createSpy('Get').and.returnValue(of({})),
    Patch: jasmine
      .createSpy('Patch')
      .and.returnValue(of({ xp: { FavoriteProducts: [] } })),
  };
  const appStateService = {
    userSubject: new BehaviorSubject<MeUser>({ xp: { 'FavoriteProducts': ['Id1', 'Id2'] } })
  }

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        FavoriteProductsService,
        { provide: AppStateService, useValue: appStateService },
        { provide: OcMeService, useValue: meService },
      ],
    });
    service = TestBed.get(FavoriteProductsService);
  }));

  it('should be created', () => {
    expect(service).toBeTruthy();
  })

  it('isProductFav should return true for a favorite', () => {
    service.favorites = ['a', 'b', 'c'];
    expect(service.isFavorite({ ID: 'a' })).toEqual(true);
  }
  );

  it('isProductFav should return false for a non-favorite', () => {
    service.favorites = ['a', 'b', 'c'];
    expect(service.isFavorite({ ID: 'd' })).toEqual(false);
  }
  );

  it('setProductAsFav should remove fav correctly', () => {
    meService.Patch.calls.reset();
    service.favorites = ['a', 'b'];
    service.setFavoriteValue(false, { ID: 'a' });
    expect(meService.Patch).toHaveBeenCalledWith({
      xp: { FavoriteProducts: ['b'] },
    });
  }
  );

  it('setProductAsFav should add fav correctly', () => {
    meService.Patch.calls.reset();
    service.favorites = ['a', 'b'];
    service.setFavoriteValue(true, { ID: 'c' });
    expect(meService.Patch).toHaveBeenCalledWith({
      xp: { FavoriteProducts: ['a', 'b', 'c'] },
    });
  }
  );
});
