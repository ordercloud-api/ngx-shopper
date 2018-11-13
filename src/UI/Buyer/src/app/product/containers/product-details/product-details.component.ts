import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  AfterViewChecked,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, forkJoin, of } from 'rxjs';
import { flatMap, tap, catchError } from 'rxjs/operators';
import { AppLineItemService, AppStateService } from '@app-buyer/shared';
import { BuyerProduct, OcMeService } from '@ordercloud/angular-sdk';
import { QuantityInputComponent } from '@app-buyer/shared/components/quantity-input/quantity-input.component';
import { AddToCartEvent } from '@app-buyer/shared/models/add-to-cart-event.interface';
import { minBy as _minBy } from 'lodash';
import { FavoriteProductsService } from '@app-buyer/shared/services/favorites/favorites.service';

@Component({
  selector: 'product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent implements OnInit, AfterViewChecked {
  @ViewChild(QuantityInputComponent)
  quantityInputComponent: QuantityInputComponent;
  quantityInputReady = false;
  product: BuyerProduct;
  relatedProducts$: Observable<BuyerProduct[]>;
  imageUrls: string[] = [];

  constructor(
    private ocMeService: OcMeService,
    private activatedRoute: ActivatedRoute,
    private appLineItemService: AppLineItemService,
    private appStateService: AppStateService,
    private changeDetectorRef: ChangeDetectorRef,
    protected favoriteProductService: FavoriteProductsService // used in template
  ) {}

  ngOnInit(): void {
    this.getProductData()
      .pipe(
        catchError(() => {
          return of(null);
        })
      )
      .subscribe((x) => (this.product = x));
  }

  getProductData(): Observable<BuyerProduct> {
    return this.activatedRoute.params.pipe(
      flatMap((params) => {
        if (params.productID) {
          return this.ocMeService.GetProduct(params.productID).pipe(
            tap((prod) => {
              this.relatedProducts$ = this.getRelatedProducts(prod);
            })
          );
        }
      })
    );
  }

  getRelatedProducts(product: BuyerProduct): Observable<BuyerProduct[]> {
    if (!product.xp || !product.xp.RelatedProducts) {
      return of([]);
    }

    const requests = product.xp.RelatedProducts.map((prodID) =>
      this.ocMeService.GetProduct(prodID)
    );

    return forkJoin(requests);
  }

  addToCart(event: AddToCartEvent): void {
    this.appLineItemService
      .create(event.product, event.quantity)
      .subscribe(() => this.appStateService.addToCartSubject.next(event));
  }

  isOrderable(): boolean {
    // products without a price schedule are view-only.
    return !!this.product.PriceSchedule;
  }

  hasPrice(): boolean {
    // free products dont need to display a price.
    return (
      this.product.PriceSchedule &&
      this.product.PriceSchedule.PriceBreaks.length &&
      this.product.PriceSchedule.PriceBreaks[0].Price > 0
    );
  }

  getTotalPrice(): number {
    // In OC, the price per item can depend on the quantity ordered. This info is stored on the PriceSchedule as a list of PriceBreaks.
    // Find the PriceBreak with the highest Quantity less than the quantity ordered. The price on that price break
    // is the cost per item.
    if (!this.quantityInputComponent || !this.quantityInputComponent.form) {
      return null;
    }
    if (!this.hasPrice()) {
      return 0;
    }
    const quantity = this.quantityInputComponent.form.value.quantity;
    const priceBreaks = this.product.PriceSchedule.PriceBreaks;
    const startingBreak = _minBy(priceBreaks, 'Quantity');

    const selectedBreak = priceBreaks.reduce((current, candidate) => {
      return candidate.Quantity > current.Quantity &&
        candidate.Quantity <= quantity
        ? candidate
        : current;
    }, startingBreak);

    return selectedBreak.Price * quantity;
  }

  ngAfterViewChecked() {
    // This manually triggers angular's change detection cycle and avoids the imfamous
    // "Expression has changed after it was checked" error.
    // If you remove the @ViewChild(QuantityInputComponent) this will be unecessary.
    this.changeDetectorRef.detectChanges();
  }
}
