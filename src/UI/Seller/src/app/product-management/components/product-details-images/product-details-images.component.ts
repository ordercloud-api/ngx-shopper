import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Product } from '@ordercloud/angular-sdk';
import {
  faTrashAlt,
  faUpload,
  faCrown,
} from '@fortawesome/free-solid-svg-icons';
import { ProductUpdate } from '@app-seller/product-management/containers/product-details/product-details.component';
import { ToastrService } from 'ngx-toastr';

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

  constructor(private toastrService: ToastrService) {}

  deleteImage(index: number) {
    this.product.xp.imageURLs.splice(index, 1);
    this.update.emit(this.product);
  }

  addImage(event) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      // Make API call to image storage integration. API should return the url at which the file is stored.
      // Then, use commented out code below to save this URL in OrderCloud. Delete the toastr.

      // const url = 'http://example.com';
      // this.product.xp.imageURLs.push(url)
      // this.update.emit(this.product);

      const message =
        'File upload functionality requires an integration with file storage. For Developers: details in file carousel-slide-display.component.ts';
      this.toastrService.warning(message);
      console.log(message);
    }
  }

  // The image that appears on a buyer's product list is the first element of the imageURLs array.
  setPrimaryImage(url: string, index: number) {
    this.product.xp.imageURLs.splice(index, 1);
    this.product.xp.imageURLs.unshift(url);
    this.update.emit(this.product);
  }
}
