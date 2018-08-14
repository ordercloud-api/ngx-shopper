import { LineItem } from '@ordercloud/angular-sdk';

export interface OrderReorderResponse {
  ValidLi: Array<LineItem>;
  InvalidLi: Array<LineItem>;
}
