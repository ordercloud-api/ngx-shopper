import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { Observable, of } from 'rxjs';
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
  sortOptions: string[];
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
    this.sortOptions = this.getSortOptions();
    this.sortForm = this.formBuilder.group({ sortBy: null });
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
          const filter = this.favsFilterOn ? { ID: this.favoriteProducts.join('|') } : '';
          return this.meService.ListProducts({
            categoryID: queryParams.category, 
            page: queryParams.page, 
            search: queryParams.search, 
            filters: <any>filter
          });
        })
      )
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
    this.meService.ListCategories({ depth: 'All', catalogID: 'SHARED' })
      .subscribe(cats => {
        this.categories = cats;
        const catID = this.activatedRoute.snapshot.queryParams.category
        this.categoryCrumbs = this.buildBreadCrumbs(catID);
      });
  }

  changePage(page: number) {
    const queryParams: any = Object.assign({}, this.activatedRoute.snapshot.queryParams);
    queryParams.page = page;
    this.router.navigate([], { queryParams: queryParams });
  }

  changeCategory(catID: string) {
    const queryParams: any = Object.assign({}, this.activatedRoute.snapshot.queryParams);
    queryParams.category = catID;
    this.router.navigate([], { queryParams: queryParams });
  }

  clearSearch() {
    const queryParams: any = Object.assign({}, this.activatedRoute.snapshot.queryParams);
    queryParams.search = '';
    this.router.navigate([], { queryParams: queryParams });
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
    this.meService.Patch({ xp: { FavoriteProducts: favs }}).subscribe(me => {
      this.favoriteProducts = me.xp.FavoriteProducts;
    });
  }

  buildBreadCrumbs(catID: string): Category[] {
    const crumbs = [];

    if (!catID || !this.categories || this.categories.Items.length < 1) {
      return crumbs;
    }

    const recursiveBuild = id => {
      const cat = this.categories.Items.find(c => c.ID === id)
      crumbs.unshift(cat);
      if (!cat.ParentID) {
        return crumbs;
      }

      return recursiveBuild(cat.ParentID);
    }

    return recursiveBuild(catID);
  }

  toProductDetails(product) {
    this.router.navigate(['/products/detail'], { queryParams: { ID: product.ID } });
  }

  getSortOptions(): string[] {
    const options = [];
    for (const strat in ProductSortStrats) {
      if (typeof strat === 'string') {
        options.push(ProductSortStrats[strat]);
      }
    }
    return options;
  }

  sortStratChanged() {
    this.productList$.subscribe(productList => {
      this.productList$ = of({
        Meta: productList.Meta,
        Items: this.sortProducts(productList.Items, this.sortForm.value.sortBy)
      });
    });
  }

  addToCart(event: AddToCartEvent) {
    this.ocLineItemService.create(event.product, event.quantity)
      .subscribe();
  }

  sortProducts(prods: BuyerProduct[], strat: ProductSortStrats): BuyerProduct[] {
    let compareFnc;

    switch (strat) {
      case ProductSortStrats.NameAsc:
        compareFnc = (a, b) => a.Name.toLowerCase().localeCompare(b.Name.toLowerCase());
        break;
      case ProductSortStrats.NameDesc:
        compareFnc = (a, b) => b.Name.toLowerCase().localeCompare(a.Name.toLowerCase());
        break;
      case ProductSortStrats.PriceAsc:
        compareFnc = (a, b) => b.PriceSchedule.PriceBreaks[0].Price - a.PriceSchedule.PriceBreaks[0].Price;
        break;
      case ProductSortStrats.PriceDesc:
        compareFnc = (a, b) => a.PriceSchedule.PriceBreaks[0].Price - b.PriceSchedule.PriceBreaks[0].Price;
        break;
      case ProductSortStrats.ID:
        compareFnc = (a, b) => a.ID.toLowerCase().localeCompare(b.ID.toLowerCase());
        break;
    }

    return prods.sort(compareFnc);
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
