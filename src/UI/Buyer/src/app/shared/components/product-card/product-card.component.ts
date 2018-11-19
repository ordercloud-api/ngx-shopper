import { takeWhile } from 'rxjs/operators';
import { AppStateService } from '@app-buyer/shared/services/app-state/app-state.service';
import {
  Component,
  Input,
  ViewChild,
  EventEmitter,
  Output,
  OnInit,
  ViewEncapsulation,
} from '@angular/core';
import { QuantityInputComponent } from '@app-buyer/shared/components/quantity-input/quantity-input.component';
import { AddToCartEvent } from '@app-buyer/shared/models/add-to-cart-event.interface';
import { BuyerProduct, ListLineItem } from '@ordercloud/angular-sdk';
import { Router } from '@angular/router';
import { find as _find } from 'lodash';

@Component({
  selector: 'product-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ProductCardComponent implements OnInit {
  @Input() product: BuyerProduct;
  @Input() favorite: boolean;
  @Input() lineItems: ListLineItem;
  @Output() addedToCart = new EventEmitter<AddToCartEvent>();
  @Output() updatedLi = new EventEmitter<any>();
  @Output() setFavorite = new EventEmitter<boolean>();
  @ViewChild(QuantityInputComponent)
  quantityInputComponent: QuantityInputComponent;
  shouldDisplayAddToCart: boolean;
  isViewOnlyProduct: boolean;
  isSetFavoriteUsed: boolean;
  alive = true;
  matchingLi;
  updatedLiInfo;

  constructor(
    private router: Router,
    private appStateService: AppStateService
  ) {}

  addToCart(event: AddToCartEvent) {
    this.addedToCart.emit(event);
  }

  sendUpdatedLi(event): void {
    /** this will send to the parent component*/
    event.LineItemId = this.matchingLi ? this.matchingLi.ID : null;
    this.updatedLi.emit(event);
  }

  ngOnInit() {
    /**
     * this will be true if the parent component
     * is wired up to listen to the outputted event
     */
    this.isSetFavoriteUsed = this.setFavorite.observers.length > 0;
    const isAddedToCartUsed = this.addedToCart.observers.length > 0;
    this.isViewOnlyProduct = !this.product.PriceSchedule;
    this.shouldDisplayAddToCart = isAddedToCartUsed && !this.isViewOnlyProduct;
    this.appStateService.lineItemSubject
      .pipe(takeWhile(() => this.alive))
      .subscribe((lineItems) => {
        this.lineItems = lineItems;
        this.matchingLi = _find(this.lineItems.Items, {
          ProductID: this.product.ID,
        });
      });
  }

  featuredProducts() {
    return this.router.url.indexOf('/home') > -1;
  }
}
