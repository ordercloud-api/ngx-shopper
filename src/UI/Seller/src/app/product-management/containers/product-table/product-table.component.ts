import { Component, OnInit } from '@angular/core';
import {
  ListBuyerProduct,
  OcProductService,
  Product,
} from '@ordercloud/angular-sdk';
import { faCircle, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { ModalService, BaseBrowse } from '@app-seller/shared';

@Component({
  selector: 'products-table',
  templateUrl: './product-table.component.html',
  styleUrls: ['./product-table.component.scss'],
})
export class ProductTableComponent extends BaseBrowse implements OnInit {
  products: ListBuyerProduct;
  requestOptions = { search: undefined, page: undefined, sortBy: undefined };
  faTrash = faTrashAlt;
  faCircle = faCircle;
  faPlusCircle = faPlusCircle;
  modalID = 'NewProductModal';

  constructor(
    private ocProductService: OcProductService,
    private modalService: ModalService
  ) {
    // BaseBrowse super class handles sorting, searching, and pagination
    super();
  }

  ngOnInit() {
    this.loadData();
  }

  openNewProductModal() {
    this.modalService.open(this.modalID);
  }

  loadData() {
    this.ocProductService
      .List(this.requestOptions)
      .subscribe((x) => (this.products = x));
  }

  deleteProduct(productID) {
    this.ocProductService.Delete(productID).subscribe(() => {
      this.loadData();
    });
  }

  addProduct(product: Product) {
    this.modalService.close(this.modalID);
    this.ocProductService.Create(product).subscribe(() => {
      this.loadData();
    });
  }
}
