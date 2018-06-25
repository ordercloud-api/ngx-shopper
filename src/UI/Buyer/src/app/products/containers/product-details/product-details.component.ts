import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, forkJoin, of } from 'rxjs';
import { flatMap, tap } from 'rxjs/operators';
import { OcLineItemService } from '@app/shared';
import { BuyerProduct, MeService } from '@ordercloud/angular-sdk';
import { QuantityInputComponent } from '@app/shared/components/quantity-input/quantity-input.component';
import { AddToCartEvent } from '@app/shared/models/add-to-cart-event.interface';

@Component({
  selector: 'products-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss']
})
export class ProductDetailsComponent implements OnInit {
  @ViewChild(QuantityInputComponent) quantityInputComponent: QuantityInputComponent;
  product$: Observable<BuyerProduct>;
  relatedProducts$: Observable<BuyerProduct[]>;
  // TODO - replace with images saved on product xp ( or somewhere else );
  imageUrls: string[] = [
    'https://www.etundra.com/images/products/500x500/commercial-plumbing-supplies/down-hoses-nozzles/chg-khr-5635-e-35-ft-covered-hose-reel-assembly/11410-1.jpg',
    'https://www.etundra.com/images/products/500x500/commercial-plumbing-supplies/down-hoses-nozzles/commercial-25-ft-hot-water-hose/11552-1.jpg',
    'https://www.etundra.com/images/products/500x500/commercial-plumbing-supplies/dipper-wells/complete/commercial-6-inch-round-drop-in-dipperwell-with-faucet/11559-1.jpg',
    'https://www.etundra.com/images/products/500x500/commercial-plumbing-supplies/dipper-wells/faucets/commercial-dipperwell-stem-handle-assembly/13227-1.jpg',
    'https://www.etundra.com/images/products/500x500/commercial-plumbing-supplies/down-hoses-nozzles/commercial-insulated-spray-nozzle/11555-1.jpg'
  ];

  constructor(
    private meService: MeService,
    private activatedRoute: ActivatedRoute,
    private ocLineItemService: OcLineItemService
  ) { }

  ngOnInit(): void {
    this.product$ = this.getProductData();
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
                })
              )
          }
        })
      );
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

  addToCart(event: AddToCartEvent) {
    this.ocLineItemService.create(event.product, event.quantity)
      .subscribe();
  }
}