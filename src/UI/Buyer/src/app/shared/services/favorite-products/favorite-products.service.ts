import { Injectable } from '@angular/core';
import { MeService, BuyerProduct } from '@ordercloud/angular-sdk';

@Injectable({
  providedIn: 'root'
})
export class FavoriteProductsService {

  constructor(private meService: MeService) { }

  // Array of product IDs
  public favorites: string[] = null;

  loadFavorites(): void {
    this.meService.Get().subscribe(me => {
      if (!me.xp || !me.xp.FavoriteProducts) {
        this.favorites = [];
      } else {
        this.favorites = me.xp.FavoriteProducts;
      }
    });
  }

  isFavorite(product: BuyerProduct): boolean {
    return (this.favorites !== null) && this.favorites.indexOf(product.ID) > -1;
  }

  setFavoriteValue(isFav: boolean, product: BuyerProduct): void {
    // TODO - is there a better solution if the favorites havn't loaded yet?
    if (this.favorites === null) { return; }

    if (isFav) {
      this.favorites.push(product.ID);
    } else {
      this.favorites = this.favorites.filter(x => x !== product.ID);
    }
    this.meService.Patch({ xp: { FavoriteProducts: this.favorites } })
      .subscribe(me => {
        this.favorites = me.xp.FavoriteProducts;
      });
  }
}
