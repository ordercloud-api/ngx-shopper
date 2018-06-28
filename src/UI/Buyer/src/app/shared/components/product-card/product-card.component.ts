import { Component, Input, ViewChild, EventEmitter, Output, OnInit, ViewEncapsulation } from '@angular/core';
import { QuantityInputComponent } from '@app/shared/components/quantity-input/quantity-input.component';
import { AddToCartEvent } from '@app/shared/models/add-to-cart-event.interface';
import { BuyerProduct } from '@ordercloud/angular-sdk';

@Component({
  selector: 'products-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProductCardComponent implements OnInit {
  @Output() addedToCart = new EventEmitter<AddToCartEvent>();
  @Input() product: BuyerProduct;
  @Input() favorite: boolean;
  @Output() setFavorite = new EventEmitter<boolean>();
  @ViewChild(QuantityInputComponent) quantityInputComponent: QuantityInputComponent;
  shouldDisplayAddToCart: boolean;
  isViewOnlyProduct: boolean;
  isSetFavoriteUsed: boolean;

  addToCart(event: AddToCartEvent) {
    this.addedToCart.emit(event);
  }

  ngOnInit() {
    /**
     * this will be true if the parent component
     * is wired up to listen to the outputted event
     */
    this.isSetFavoriteUsed = this.setFavorite.observers.length > 0;
    const isAddedToCartUsed = this.addedToCart.observers.length > 0;
    this.isViewOnlyProduct = !(this.product.PriceSchedule && this.product.PriceSchedule.PriceBreaks[0].Price > 1);
    this.shouldDisplayAddToCart = isAddedToCartUsed && !this.isViewOnlyProduct;
  }
}
