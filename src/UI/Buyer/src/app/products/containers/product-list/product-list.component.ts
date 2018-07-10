import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs';
import { flatMap, tap } from 'rxjs/operators';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ListBuyerProduct, MeService, BuyerProduct, Category, ListCategory } from '@ordercloud/angular-sdk';
import { ProductSortStrats } from '@app/products/models/product-sort-strats.enum';
import { OcLineItemService } from '@app/shared';
import { AddToCartEvent } from '@app/shared/models/add-to-cart-event.interface';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'products-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {
  productList$: Observable<ListBuyerProduct>;
  favoriteProducts: string[] = null;
  categories: ListCategory;
  categoryCrumbs: Category[] = [];
  sortOptions = ProductSortStrats;
  sortForm: FormGroup;
  favsFilterOn = false;
  searchTerm = null;
  closeIcon = faTimes;

  constructor(
    private activatedRoute: ActivatedRoute,
    private meService: MeService,
    private router: Router,
    private formBuilder: FormBuilder,
    private ocLineItemService: OcLineItemService,
  ) { }

  ngOnInit() {
    this.productList$ = this.getProductData();
    this.sortForm = this.formBuilder.group({
      sortBy: this.sortOptions[this.activatedRoute.snapshot.queryParams['sortBy']]
    });
    this.getCategories();
    this.getFavoriteProducts();
    this.configureRouter();
  }

  getProductData(): Observable<ListBuyerProduct> {
    return this.activatedRoute.queryParams
      .pipe(
        tap(queryParams => {
          this.categoryCrumbs = this.buildBreadCrumbs(queryParams.category);
        }),
        flatMap(queryParams => {
          this.searchTerm = queryParams.search || null;
          // set filter to undefined if it doesn't exist so queryParam is ignored entirely
          const filter = this.favsFilterOn ? { ID: this.favoriteProducts.join('|') } : undefined;
          return this.meService.ListProducts({
            categoryID: queryParams.category,
            page: queryParams.page,
            search: queryParams.search,
            sortBy: queryParams.sortBy,
            filters: <any>filter,
          });
        })
      );
  }

  getFavoriteProducts(): void {
    this.meService.Get().subscribe(me => {
      if (!me.xp || !me.xp.FavoriteProducts) {
        this.favoriteProducts = [];
      } else {
        this.favoriteProducts = me.xp.FavoriteProducts;
      }
    });
  }

  getCategories(): void {
    this.meService.ListCategories({ depth: 'all' })
      .subscribe(categories => {
        this.categories = categories;
        const categoryID = this.activatedRoute.snapshot.queryParams.category;
        this.categoryCrumbs = this.buildBreadCrumbs(categoryID);
      });
  }

  changePage(page: number): void { this.addQueryParam({ page }); }

  changeCategory(category: string): void { this.addQueryParam({ category }); }

  sortStratChanged(): void { this.addQueryParam({ sortBy: this.sortForm.value.sortBy }); }

  private addQueryParam(newParam: object): void {
    const queryParams = { ...this.activatedRoute.snapshot.queryParams, ...newParam};
    this.router.navigate([], { queryParams });
  }

  isProductFav(prod: BuyerProduct): boolean {
    return this.favoriteProducts.indexOf(prod.ID) > -1;
  }

  setFavsFilter(filterOn: boolean) {
    this.favsFilterOn = filterOn;
    this.productList$ = this.getProductData();
  }

  setProductAsFav(isFav: boolean, productID: string) {
    let favs = this.favoriteProducts;
    if (isFav) {
      favs.push(productID);
    } else {
      favs = favs.filter(x => x !== productID);
    }
    this.meService.Patch({ xp: { FavoriteProducts: favs } }).subscribe(me => {
      this.favoriteProducts = me.xp.FavoriteProducts;
    });
  }

  buildBreadCrumbs(catID: string): Category[] {
    const crumbs = [];

    if (!catID || !this.categories || this.categories.Items.length < 1) {
      return crumbs;
    }

    const recursiveBuild = id => {
      const cat = this.categories.Items.find(c => c.ID === id);
      crumbs.unshift(cat);
      if (!cat.ParentID) {
        return crumbs;
      }

      return recursiveBuild(cat.ParentID);
    };

    return recursiveBuild(catID);
  }

  toProductDetails(product) {
    this.router.navigate(['/products/detail'], { queryParams: { ID: product.ID } });
  }

  addToCart(event: AddToCartEvent) {
    this.ocLineItemService.create(event.product, event.quantity)
      .subscribe();
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
    this.router.events.subscribe(evt => {
      if (evt instanceof NavigationEnd) {
        this.router.navigated = false;
        window.scrollTo(0, 0);
      }
    });
  }
}
