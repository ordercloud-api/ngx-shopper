import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs';
import { flatMap, tap } from 'rxjs/operators';
import { FormGroup, FormBuilder } from '@angular/forms';
import {
  ListBuyerProduct,
  OcMeService,
  Category,
  ListCategory,
} from '@ordercloud/angular-sdk';
import { ProductSortStrats } from '@app-buyer/products/models/product-sort-strats.enum';
import { AppLineItemService, AppStateService } from '@app-buyer/shared';
import { AddToCartEvent } from '@app-buyer/shared/models/add-to-cart-event.interface';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FavoriteProductsService } from '@app-buyer/shared/services/favorites/favorites.service';
import { isEmpty as _isEmpty } from 'lodash';

@Component({
  selector: 'products-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent implements OnInit {
  productList$: Observable<ListBuyerProduct>;
  categories: ListCategory;
  categoryCrumbs: Category[] = [];
  sortOptions = ProductSortStrats;
  sortForm: FormGroup;
  searchTerm = null;
  hasQueryParams = false;
  hasFavoriteProductsFilter = false;
  closeIcon = faTimes;

  constructor(
    private activatedRoute: ActivatedRoute,
    private ocMeService: OcMeService,
    private router: Router,
    private formBuilder: FormBuilder,
    private appLineItemService: AppLineItemService,
    private favoriteProductsService: FavoriteProductsService,
    private appStateService: AppStateService,
  ) { }

  ngOnInit() {
    this.productList$ = this.getProductData();
    this.favoriteProductsService.loadFavorites();
    this.sortForm = this.formBuilder.group({
      sortBy: this.sortOptions[
        this.activatedRoute.snapshot.queryParams['sortBy']
      ],
    });
    this.getCategories();
    this.configureRouter();
  }

  getProductData(): Observable<ListBuyerProduct> {
    return this.activatedRoute.queryParams.pipe(
      tap((queryParams) => {
        this.hasFavoriteProductsFilter =
          queryParams.favoriteProducts === 'true';
        this.hasQueryParams = !_isEmpty(queryParams);
        this.categoryCrumbs = this.buildBreadCrumbs(queryParams.category);
      }),
      flatMap((queryParams) => {
        this.searchTerm = queryParams.search || null;
        const filter = {};

        // add filter for favorite products if it exists
        if (
          queryParams.favoriteProducts === 'true' &&
          this.favoriteProductsService.favorites
        ) {
          filter['ID'] = this.favoriteProductsService.favorites.join('|');
        } else {
          delete filter['ID'];
        }
        return this.ocMeService.ListProducts({
          categoryID: queryParams.category,
          page: queryParams.page,
          search: queryParams.search,
          sortBy: queryParams.sortBy,
          filters: <any>filter,
        });
      })
    );
  }

  getCategories(): void {
    this.ocMeService
      .ListCategories({ depth: 'all' })
      .subscribe((categories) => {
        this.categories = categories;
        const categoryID = this.activatedRoute.snapshot.queryParams.category;
        this.categoryCrumbs = this.buildBreadCrumbs(categoryID);
      });
  }

  clearAllFilters() {
    this.router.navigate([]);
  }

  changePage(page: number): void {
    this.addQueryParam({ page });
  }

  changeCategory(category: string): void {
    this.addQueryParam({ category });
  }

  sortStratChanged(): void {
    this.addQueryParam({ sortBy: this.sortForm.value.sortBy });
  }

  refineByFavorites() {
    const queryParams = this.activatedRoute.snapshot.queryParams;
    if (queryParams.favoriteProducts === 'true') {
      // favorite products was previously set to true so toggle off
      // set to undefined so we dont pollute url with unnecessary query params
      this.addQueryParam({ favoriteProducts: undefined });
    } else {
      this.addQueryParam({ favoriteProducts: true });
    }
  }

  private addQueryParam(newParam: object): void {
    const queryParams = {
      ...this.activatedRoute.snapshot.queryParams,
      ...newParam,
    };
    this.router.navigate([], { queryParams });
  }

  buildBreadCrumbs(catID: string): Category[] {
    const crumbs = [];

    if (!catID || !this.categories || this.categories.Items.length < 1) {
      return crumbs;
    }

    const recursiveBuild = (id) => {
      const cat = this.categories.Items.find((c) => c.ID === id);
      crumbs.unshift(cat);
      if (!cat.ParentID) {
        return crumbs;
      }

      return recursiveBuild(cat.ParentID);
    };

    return recursiveBuild(catID);
  }

  addToCart(event: AddToCartEvent) {
    this.appLineItemService
      .create(event.product, event.quantity)
      .subscribe(() => this.appStateService.addToCartSubject.next(event));
  }

  configureRouter() {
    /**
     *
     * override angular's default routing behavior so that
     * going to the same route with different query params are
     * detected as a state change. This fixes bug where >2 query
     * params of the same type aren't recognized
     *
     */
    this.router.events.subscribe((evt) => {
      if (evt instanceof NavigationEnd) {
        this.router.navigated = false;
        window.scrollTo(0, 0);
      }
    });
  }
}
