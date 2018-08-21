import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Product } from '@ordercloud/angular-sdk';
import {
  faTrashAlt,
  faUpload,
  faCheckSquare,
  faCrown,
} from '@fortawesome/free-solid-svg-icons';
import { ProductUpdate } from '@app-seller/product-management/containers/product-details/product-details.component';

@Component({
  selector: 'products-details-images',
  templateUrl: './product-details-images.component.html',
  styleUrls: ['./product-details-images.component.scss'],
})
export class ProductDetailsImagesComponent {
  @Input() product: Product;
  @Output() update = new EventEmitter<ProductUpdate>();
  faTrash = faTrashAlt;
  faUpload = faUpload;
  faCrown = faCrown;

  constructor() {}

  deleteImage(index: number) {
    this.product.xp.additionalImages.splice(index, 1);
    this.update.emit(this.product);
  }

  addImage(url: string) {}

  makeImagePrimary(url: string, index: number) {
    this.product.xp.additionalImages.splice(index, 1);
    this.product.xp.additionalImages.unshift(this.product.xp.primaryImageURL);
    this.product.xp.primaryImageURL = url;
    this.update.emit(this.product);
  }
}
