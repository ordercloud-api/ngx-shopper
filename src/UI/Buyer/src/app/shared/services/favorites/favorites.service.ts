import { Injectable, Inject } from '@angular/core';
import { OcMeService, BuyerProduct, Order } from '@ordercloud/angular-sdk';
import { AppStateService } from '@app-buyer/shared';
import { ToastrService } from 'ngx-toastr';

abstract class FavoritesService<T extends { ID?: string }> {
  protected abstract readonly XpFieldName: string;
  protected abstract readonly TypeDisplayName: string;
  // All OrderCloud xp objects are limited to 8000 chars. With guid's of length ~24, 40 favorites is ~1000 chars.
  private readonly MaxFavorites: number = 40;

  constructor(
    private appStateService: AppStateService,
    private ocMeService: OcMeService,
    private toastrService: ToastrService
  ) {}

  isFavorite(object: T): boolean {
    const favorites = this.getFavorites();
    return favorites.includes(object.ID);
  }

  setFavoriteValue(isFav: boolean, object: T): void {
    const favorites = this.getFavorites();
    let updatedFavorites: string[];
    if (isFav && favorites.length >= this.MaxFavorites) {
      this.toastrService.info(
        `You have reached your limit of favorite ${this.TypeDisplayName}`
      );
      return;
    }
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
    return me.xp && me.xp[this.XpFieldName] instanceof Array
      ? me.xp[this.XpFieldName]
      : [];
  }
}

@Injectable({
  providedIn: 'root',
})
export class FavoriteProductsService extends FavoritesService<BuyerProduct> {
  protected readonly XpFieldName = 'FavoriteProducts';
  protected readonly TypeDisplayName = 'products';

  constructor(
    @Inject(AppStateService) appStateService: AppStateService,
    @Inject(OcMeService) ocMeService: OcMeService,
    @Inject(ToastrService) toastrService: ToastrService
  ) {
    super(appStateService, ocMeService, toastrService);
  }
}

@Injectable({
  providedIn: 'root',
})
export class FavoriteOrdersService extends FavoritesService<Order> {
  protected readonly XpFieldName = 'FavoriteOrders';
  protected readonly TypeDisplayName = 'orders';

  constructor(
    @Inject(AppStateService) appStateService: AppStateService,
    @Inject(OcMeService) ocMeService: OcMeService,
    @Inject(ToastrService) toastrService: ToastrService
  ) {
    super(appStateService, ocMeService, toastrService);
  }
}
