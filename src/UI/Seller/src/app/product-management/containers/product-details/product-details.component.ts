import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { Product, OcProductService } from '@ordercloud/angular-sdk';
import { flatMap } from 'rxjs/operators';
import { faBoxOpen } from '@fortawesome/free-solid-svg-icons';
import { faImage } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'product-details',
  templateUrl: './product-details.component.html',
  styleUrls: ['./product-details.component.scss'],
})
export class ProductDetailsComponent implements OnInit {
  product: Product;
  productID: string;
  faBoxOpen = faBoxOpen;
  faImage = faImage;

  constructor(
    private activatedRoute: ActivatedRoute,
    private ocProductService: OcProductService,
    private router: Router
  ) {}

  ngOnInit() {
    this.getProductData().subscribe((x) => (this.product = x));
  }

  getProductData(): Observable<Product> {
    return this.activatedRoute.params.pipe(
      flatMap((params) => {
        if (params.productID) {
          this.productID = params.productID;
          return this.ocProductService.Get(params.productID);
        }
      })
    );
  }

  updateProduct(product: Product): void {
    this.ocProductService.Patch(this.productID, product).subscribe((x) => {
      this.product = x;
      if (this.product.ID !== this.productID) {
        this.router.navigateByUrl(`/products/${this.product.ID}`);
      }
    });
  }
}
