import { LineItem } from '@ordercloud/angular-sdk';

export interface orderReorderResponse{
    ValidLi: Array<LineItem>, 
    InvalidLi: Array<LineItem> 
}