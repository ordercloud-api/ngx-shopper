import {
  Component,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
  AfterViewChecked,
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, forkJoin, of } from 'rxjs';
import { CartService, AppStateService } from '@app-buyer/shared';
import {
  BuyerProduct,
  OcMeService,
  BuyerSpec,
  LineItemSpec,
} from '@ordercloud/angular-sdk';
import { QuantityInputComponent } from '@app-buyer/shared/components/quantity-input/quantity-input.component';
import { AddToCartEvent } from '@app-buyer/shared/models/add-to-cart-event.interface';
import { minBy as _minBy } from 'lodash';
import { FavoriteProductsService } from '@app-buyer/shared/services/favorites/favorites.service';
import { find as _find } from 'lodash';
import { SpecFormComponent } from '../spec-form/spec-form.component';
@Component({
  selector: 'product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent implements OnInit, AfterViewChecked {
  @ViewChild(QuantityInputComponent)
  quantityInputComponent: QuantityInputComponent;
  @ViewChild(SpecFormComponent)
  specFormComponent: SpecFormComponent;
  quantityInputReady = false;
  specs: BuyerSpec[] = [];
  product: BuyerProduct;
  relatedProducts$: Observable<BuyerProduct[]>;
  imageUrls: string[] = [];

  constructor(
    private ocMeService: OcMeService,
    private activatedRoute: ActivatedRoute,
    private cartService: CartService,
    private appStateService: AppStateService,
    private changeDetectorRef: ChangeDetectorRef,
    protected favoriteProductService: FavoriteProductsService, // used in template
    private router: Router
  ) {}

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(async (params) => {
      await this.getProductData(params.productID);
    });
  }

  routeToProductList(): void {
    this.router.navigate(['/products']);
  }

  async getProductData(productID: string): Promise<void> {
    if (!productID) return;
    this.product = await this.ocMeService.GetProduct(productID).toPromise();
    this.specs = await this.listSpecs(productID);
    this.relatedProducts$ = this.getRelatedProducts(this.product);
  }

  async listSpecs(productID: string): Promise<BuyerSpec[]> {
    const specs = await this.ocMeService.ListSpecs(productID).toPromise();
    const details = specs.Items.map((spec) => {
      return this.ocMeService.GetSpec(productID, spec.ID).toPromise();
    });
    return await Promise.all(details);
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
    const specs: LineItemSpec[] = [];
    const form = this.specFormComponent.specForm.value;
    for (const specID in form) {
      if (form.hasOwnProperty(specID)) {
        specs.push({ SpecID: specID, OptionID: form[specID] });
      }
    }

    this.cartService
      .addToCart(event.product.ID, event.quantity, specs)
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

  missingRequiredSpec(): boolean {
    if (!this.specFormComponent) return false;

    return this.specFormComponent.specForm.invalid;
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
