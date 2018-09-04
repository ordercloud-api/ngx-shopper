import { Injectable, Inject } from '@angular/core';
import { OcMeService, BuyerProduct, Order } from '@ordercloud/angular-sdk';
import { AppStateService } from '@app-buyer/shared';

abstract class FavoritesService<T extends { ID?: string }> {
  protected readonly XpFieldName: string;

  constructor(
    private appStateService: AppStateService,
    private ocMeService: OcMeService
  ) {}

  isFavorite(object: T): boolean {
    const favorites = this.getFavorites();
    return favorites.includes(object.ID);
  }

  setFavoriteValue(isFav: boolean, object: T): void {
    const favorites = this.getFavorites();
    let updatedFavorites: string[];
    if (isFav) {
      updatedFavorites = [...favorites, object.ID];
    } else {
      updatedFavorites = favorites.filter((x) => x !== object.ID);
    }
    const request = { xp: {} };
    request.xp[this.XpFieldName] = updatedFavorites;
    this.ocMeService.Patch(request).subscribe((me) => {
      this.appStateService.userSubject.next(me);
    });
  }

  getFavorites(): string[] {
    const me = this.appStateService.userSubject.value;
    return me.xp &&
      me.xp[this.XpFieldName] &&
      me.xp[this.XpFieldName] instanceof Array
      ? me.xp[this.XpFieldName]
      : [];
  }
}

@Injectable({
  providedIn: 'root',
})
export class FavoriteProductsService extends FavoritesService<BuyerProduct> {
  protected readonly XpFieldName = 'FavoriteProducts';

  constructor(
    @Inject(AppStateService) appStateService: AppStateService,
    @Inject(OcMeService) ocMeService: OcMeService
  ) {
    super(appStateService, ocMeService);
  }
}

@Injectable({
  providedIn: 'root',
})
export class FavoriteOrdersService extends FavoritesService<Order> {
  protected readonly XpFieldName = 'FavoriteOrders';

  constructor(
    @Inject(AppStateService) appStateService: AppStateService,
    @Inject(OcMeService) ocMeService: OcMeService
  ) {
    super(appStateService, ocMeService);
  }
}
