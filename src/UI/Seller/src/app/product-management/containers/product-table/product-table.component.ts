import { Component, OnInit } from '@angular/core';
import {
  ListBuyerProduct,
  OcProductService,
  Product,
} from '@ordercloud/angular-sdk';
import { faCircle, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { ModalService } from '@app-seller/shared';
import { ToastrService } from 'ngx-toastr';

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
  faPlusCircle = faPlusCircle;
  modalID = 'NewProductModal';

  constructor(
    private ocProductService: OcProductService,
    private modalService: ModalService,
    private toasterService: ToastrService
  ) {}

  ngOnInit() {
    this.loadProducts();
  }

  openNewProductModal() {
    this.modalService.open(this.modalID);
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

  addProduct(product: Product) {
    this.modalService.close(this.modalID);
    this.ocProductService.Create(product).subscribe(() => {
      this.loadProducts();
    });
  }
}
