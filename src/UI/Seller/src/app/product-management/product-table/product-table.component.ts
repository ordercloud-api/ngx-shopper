import { Component, OnInit } from '@angular/core';
import { ListBuyerProduct, OcProductService } from '@ordercloud/angular-sdk';
import { faCircle } from '@fortawesome/free-solid-svg-icons';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';

@Component({
  selector: 'products-table',
  templateUrl: './product-table.component.html',
  styleUrls: ['./product-table.component.scss'],
})
export class ProductTableComponent implements OnInit {
  products: ListBuyerProduct;
  requestOptions = { search: undefined, page: undefined, sortBy: undefined };
  faTrash = faTrashAlt;
  faCircle = faCircle;

  constructor(private ocProductService: OcProductService) {}

  ngOnInit() {
    this.loadProducts();
  }

  pageChanged(page: number) {
    Object.assign(this.requestOptions, { page: page });
    this.loadProducts();
  }

  searchChanged(searchStr: string) {
    Object.assign(this.requestOptions, { search: searchStr, page: undefined });
    this.loadProducts();
  }

  sortChanged(sortStr: string) {
    Object.assign(this.requestOptions, { sortBy: sortStr, page: undefined });
    this.loadProducts();
  }

  loadProducts() {
    this.ocProductService
      .List(this.requestOptions)
      .subscribe((x) => (this.products = x));
  }

  deleteProduct(productID) {
    this.ocProductService.Delete(productID).subscribe(() => {
      this.loadProducts();
    });
  }
}
