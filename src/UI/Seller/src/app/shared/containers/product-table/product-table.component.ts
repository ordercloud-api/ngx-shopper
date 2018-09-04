import { Component, OnInit, Input, Inject } from '@angular/core';
import {
  ListBuyerProduct,
  OcProductService,
  Product,
  OcCategoryService,
  ListProductAssignment,
  ListCategoryProductAssignment,
} from '@ordercloud/angular-sdk';
import { faCircle, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { BaseBrowse } from '@app-seller/shared/models/base-browse.class';
import { ModalService } from '@app-seller/shared/services/modal/modal.service';
import { forkJoin } from 'rxjs';
import {
  applicationConfiguration,
  AppConfig,
} from '@app-seller/config/app.config';

@Component({
  selector: 'product-table',
  templateUrl: './product-table.component.html',
  styleUrls: ['./product-table.component.scss'],
})
export class ProductTableComponent extends BaseBrowse implements OnInit {
  products: ListBuyerProduct;
  faTrash = faTrashAlt;
  faCircle = faCircle;
  faPlusCircle = faPlusCircle;
  modalID = 'NewProductModal';
  catalogID: string;
  @Input()
  columns = ['ID', 'Name', 'Active', 'Delete'];

  // Only use this when assigning products to a category.
  @Input()
  categoryID: string;

  constructor(
    private ocProductService: OcProductService,
    private ocCategoryService: OcCategoryService,
    private modalService: ModalService,
    @Inject(applicationConfiguration) private appConfig: AppConfig
  ) {
    // BaseBrowse super class handles sorting, searching, and pagination
    super();
  }

  ngOnInit() {
    this.catalogID = this.appConfig.buyerID;
    this.loadData();
  }

  openNewProductModal() {
    this.modalService.open(this.modalID);
  }

  loadData() {
    this.ocProductService.List(this.requestOptions).subscribe((products) => {
      if (this.columns.indexOf('Assign') < 0 || !this.categoryID) {
        return (this.products = products);
      }
      const queue = products.Items.map((product) => {
        return this.ocCategoryService.ListProductAssignments(this.catalogID, {
          productID: product.ID,
          categoryID: this.categoryID,
        });
      });
      forkJoin(queue).subscribe(
        (assignments: ListCategoryProductAssignment[]) => {
          assignments = assignments.filter(
            (assignment) => assignment.Items.length > 0
          );
          assignments.forEach((assignment) => {
            const index = products.Items.findIndex(
              (product) => product.ID === assignment.Items[0].ProductID
            );
            (products.Items[index] as any).Assigned = true;
          });
          this.products = products;
        }
      );
    });
  }

  assignProduct(productID: string, assigned: boolean) {
    const request = assigned
      ? this.ocCategoryService.SaveProductAssignment(this.catalogID, {
          ProductID: productID,
          CategoryID: this.categoryID,
        })
      : this.ocCategoryService.DeleteProductAssignment(
          this.catalogID,
          this.categoryID,
          productID
        );
    request.subscribe();
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
