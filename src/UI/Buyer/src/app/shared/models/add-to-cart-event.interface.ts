import { BuyerProduct } from '@ordercloud/angular-sdk';

export interface AddToCartEvent {
  product: BuyerProduct;
  quantity: number;
}
