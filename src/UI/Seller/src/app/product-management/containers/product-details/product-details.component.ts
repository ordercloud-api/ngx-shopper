import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { Product, OcProductService } from '@ordercloud/angular-sdk';
import { flatMap } from 'rxjs/operators';
import { faBoxOpen } from '@fortawesome/free-solid-svg-icons';
import { faImage } from '@fortawesome/free-regular-svg-icons';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'products-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent implements OnInit {
  product: Product;
  faBoxOpen = faBoxOpen;
  faImage = faImage;

  constructor(
    private activatedRoute: ActivatedRoute,
    private ocProductService: OcProductService,
    private toastrService: ToastrService
  ) {}

  ngOnInit() {
    this.getProductData().subscribe((x) => (this.product = x));
  }

  getProductData(): Observable<Product> {
    return this.activatedRoute.params.pipe(
      flatMap((params) => {
        if (params.productID) {
          return this.ocProductService.Get(params.productID);
        }
      })
    );
  }

  updateProduct(product: Product): void {
    if (!product.ID) {
      throw Error('Cannot update a product without an ID');
    }

    this.ocProductService
      .Patch(product.ID, product)
      .subscribe((x) => (this.product = x));
  }
}
