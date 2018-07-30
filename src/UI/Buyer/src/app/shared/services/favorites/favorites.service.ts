import { Injectable, Inject } from '@angular/core';
import { OcMeService, BuyerProduct, Order } from '@ordercloud/angular-sdk';

abstract class FavoritesService<T extends { ID?: string }> {
  protected readonly XpFieldName: string;

  // Array of object IDs
  public favorites: string[] = null;

  constructor(private ocMeService: OcMeService) {}

  loadFavorites(): void {
    if (this.favorites !== null) {
      return;
    }

    this.ocMeService.Get().subscribe((me) => {
      this.favorites =
        me.xp && me.xp[this.XpFieldName] ? me.xp[this.XpFieldName] : [];
    });
  }

  isFavorite(object: T): boolean {
    return this.favorites !== null && this.favorites.indexOf(object.ID) > -1;
  }

  setFavoriteValue(isFav: boolean, object: T): void {
    // TODO - is there a better solution if the favorites havn't loaded yet?
    if (this.favorites === null) {
      return;
    }

    if (isFav) {
      this.favorites.push(object.ID);
    } else {
      this.favorites = this.favorites.filter((x) => x !== object.ID);
    }
    const request = { xp: {} };
    request.xp[this.XpFieldName] = this.favorites;
    this.ocMeService.Patch(request).subscribe((me) => {
      this.favorites = me.xp[this.XpFieldName];
    });
  }
}

@Injectable({
  providedIn: 'root',
})
export class FavoriteProductsService extends FavoritesService<BuyerProduct> {
  protected readonly XpFieldName = 'FavoriteProducts';

  constructor(@Inject(OcMeService) ocMeService: OcMeService) {
    super(ocMeService);
  }
}

@Injectable({
  providedIn: 'root',
})
export class FavoriteOrdersService extends FavoritesService<Order> {
  protected readonly XpFieldName = 'FavoriteOrders';

  constructor(@Inject(OcMeService) ocMeService: OcMeService) {
    super(ocMeService);
  }
}
