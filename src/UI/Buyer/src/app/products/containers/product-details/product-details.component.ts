import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, forkJoin, of } from 'rxjs';
import { flatMap, tap } from 'rxjs/operators';
import { OcLineItemService } from '@app-buyer/shared';
import { BuyerProduct, MeService } from '@ordercloud/angular-sdk';
import { QuantityInputComponent } from '@app-buyer/shared/components/quantity-input/quantity-input.component';
import { AddToCartEvent } from '@app-buyer/shared/models/add-to-cart-event.interface';
import { minBy as _minBy } from 'lodash';
import { FavoriteProductsService } from '@app-buyer/shared/services/favorites/favorites.service';

@Component({
  selector: 'products-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  @ViewChild(QuantityInputComponent) quantityInputComponent: QuantityInputComponent;
  quantityInputReady = false;
  product: BuyerProduct;
  relatedProducts$: Observable<BuyerProduct[]>;
  imageUrls: string[] = [];
  quantity: number;

  constructor(
    private meService: MeService,
    private activatedRoute: ActivatedRoute,
    private ocLineItemService: OcLineItemService,
    private favoriteProductsService: FavoriteProductsService
  ) { }

  ngOnInit(): void {
    this.getProductData().subscribe(x => this.product = x);
    this.favoriteProductsService.loadFavorites();
  }

  getProductData(): Observable<BuyerProduct> {
    return this.activatedRoute.queryParams
      .pipe(
        flatMap(queryParams => {
          if (queryParams.ID) {
            return this.meService.GetProduct(queryParams.ID)
              .pipe(
                tap(prod => {
                  this.relatedProducts$ = this.getRelatedProducts(prod);
                  if (!prod.xp) { return; }
                  this.imageUrls = [prod.xp.primaryImageURL, ...prod.xp.additionalImages];
                })
              );
          }
        })
      );
  }

  quantityChanged(qty: number): void {
    this.quantity = qty;
  }

  getRelatedProducts(product: BuyerProduct): Observable<BuyerProduct[]> {
    const queue = [];
    if (!product.xp || !product.xp.RelatedProducts) {
      return of(queue);
    }

    product.xp.RelatedProducts.forEach(prodID => {
      queue.push(this.meService.GetProduct(prodID));
    });

    return forkJoin(queue);
  }

  addToCart(event: AddToCartEvent): void {
    this.ocLineItemService.create(event.product, event.quantity)
      .subscribe();
  }

  isOrderable(): boolean {
    // products without a price schedule are view-only.
    return !!this.product.PriceSchedule;
  }

  hasPrice(): boolean {
    // free products dont need to display a price.
    return this.product.PriceSchedule &&
    this.product.PriceSchedule.PriceBreaks.length &&
    this.product.PriceSchedule.PriceBreaks[0].Price > 0;
  }

  getTotalPrice(): number {
    // In OC, the price per item can depend on the quantity ordered. This info is stored on the PriceSchedule as a list of PriceBreaks.
    // Find the PriceBreak with the highest Quantity less than the quantity ordered. The price on that price break
    // is the cost per item.
    if (!this.quantity) { return null; }
    if (!this.hasPrice()) { return 0; }

    const priceBreaks = this.product.PriceSchedule.PriceBreaks;
    const startingBreak = _minBy(priceBreaks, 'Quantity');

    const selectedBreak = priceBreaks.reduce((current, candidate) => {
      return ((candidate.Quantity > current.Quantity) && (candidate.Quantity <= this.quantity)) ? candidate : current;
    }, startingBreak);

    return selectedBreak.Price * this.quantity;
  }
}
