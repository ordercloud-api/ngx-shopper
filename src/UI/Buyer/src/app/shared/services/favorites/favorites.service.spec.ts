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
    userSubject: new BehaviorSubject<MeUser>({
      xp: { FavoriteProducts: ['Id1', 'Id2'] },
    }),
  };

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
  });

  describe('isFavorite', () => {
    it('should return true if product is in favorites array', () => {
      spyOn(service, 'getFavorites').and.returnValue(['a', 'b', 'c']);
      expect(service.isFavorite({ ID: 'a' })).toEqual(true);
    });
    it('should return false if product is not in favorites array', () => {
      spyOn(service, 'getFavorites').and.returnValue(['a', 'b', 'c']);
      expect(service.isFavorite({ ID: 'd' })).toEqual(false);
    });
  });

  describe('setFavoriteValue', () => {
    it('should remove fav correctly', () => {
      meService.Patch.calls.reset();
      spyOn(service, 'getFavorites').and.returnValue(['a', 'b']);
      service.setFavoriteValue(false, { ID: 'a' });
      expect(meService.Patch).toHaveBeenCalledWith({
        xp: { FavoriteProducts: ['b'] },
      });
    });
    it('should add fav correctly', () => {
      meService.Patch.calls.reset();
      spyOn(service, 'getFavorites').and.returnValue(['a', 'b']);
      service.setFavoriteValue(true, { ID: 'c' });
      expect(meService.Patch).toHaveBeenCalledWith({
        xp: { FavoriteProducts: ['a', 'b', 'c'] },
      });
    });
  });

  describe('getFavorites', () => {
    it('should return an empty array if me.xp is not defined', () => {
      appStateService.userSubject.next(<MeUser>{ xp: undefined });
      expect(service.getFavorites()).toEqual([]);
    });
    it('should return an empty array if me.xp.XpFieldName is undefined', () => {
      appStateService.userSubject.next(<MeUser>{
        xp: { FavoriteProducts: undefined },
      });
      expect(service.getFavorites()).toEqual([]);
    });
    it('should return an empty array if me.xp.XpFieldName is a string', () => {
      appStateService.userSubject.next(<MeUser>{
        xp: { FavoriteProducts: 'not an array' },
      });
      expect(service.getFavorites()).toEqual([]);
    });
    it('should return me.xp.XpFieldName if it is a non-empty array', () => {
      appStateService.userSubject.next(<MeUser>{
        xp: { FavoriteProducts: ['IDOne', 'IDTwo'] },
      });
      expect(service.getFavorites()).toEqual(['IDOne', 'IDTwo']);
    });
  });
});
