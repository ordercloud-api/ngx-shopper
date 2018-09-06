import { ModalComponent } from '@app-buyer/shared/components/modal/modal.component';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductListComponent } from '@app-buyer/product/containers/product-list/product-list.component';
import {
  PageTitleComponent,
  AppLineItemService,
  AppStateService,
  ModalService
} from '@app-buyer/shared';
import {
  NgbPaginationModule,
  NgbCollapseModule,
  NgbPaginationConfig,
} from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { of, BehaviorSubject, Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { OcMeService, ListBuyerProduct } from '@ordercloud/angular-sdk';
import { QuantityInputComponent } from '@app-buyer/shared/components/quantity-input/quantity-input.component';
import { RouterTestingModule } from '@angular/router/testing';
import { CategoryNavComponent } from '@app-buyer/product/components/category-nav/category-nav.component';
import { TreeModule } from 'angular-tree-component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ToggleFavoriteComponent } from '@app-buyer/shared/components/toggle-favorite/toggle-favorite.component';
import { ProductCardComponent } from '@app-buyer/shared/components/product-card/product-card.component';
import { MapToIterablePipe } from '@app-buyer/shared/pipes/map-to-iterable/map-to-iterable.pipe';
import { FavoriteProductsService } from '@app-buyer/shared/services/favorites/favorites.service';
import { SortFilterComponent } from '@app-buyer/product/components/sort-filter/sort-filter.component';
import { ProductSortStrategy } from '@app-buyer/product/models/product-sort-strategy.enum';
import { NO_ERRORS_SCHEMA } from '@angular/core';



describe('ProductListComponent', () => {
  const mockProductData = of({ Items: [], Meta: {} });
  const mockQueryParams = { category: 'CategoryID' };
  const mockCategoryData = of({
    Items: [{ ID: 'CategoryID' }, { ID: 'category2' }],
    Meta: {},
  });
  const mockMe = of({ xp: { FavoriteProducts: [] } });

  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  const queryParams = new BehaviorSubject<any>(mockQueryParams);
  const ocMeService = {
    ListProducts: jasmine
      .createSpy('ListProducts')
      .and.returnValue(mockProductData),
    ListCategories: jasmine
      .createSpy('ListCategories')
      .and.returnValue(mockCategoryData),
    Get: jasmine.createSpy('Get').and.returnValue(mockMe),
    Patch: jasmine.createSpy('Patch').and.returnValue(mockMe),
  };
  const ocLineItemService = {
    create: jasmine.createSpy('create').and.returnValue(of(null)),
  };
  const favoriteProductsService = {
    getFavorites: () => ['Id1', 'Id2'],
  };
  const modalService = {
    open: jasmine.createSpy('openCategoryModal'),
    close: jasmine.createSpy('closeCategoryModal'),
  };
  let appStateService: AppStateService;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ProductListComponent,
        PageTitleComponent,
        ProductCardComponent,
        QuantityInputComponent,
        CategoryNavComponent,
        ToggleFavoriteComponent,
        MapToIterablePipe,
        SortFilterComponent
      ],
      imports: [
        NgbPaginationModule,
        NgbCollapseModule,
        ReactiveFormsModule,
        RouterTestingModule,
        TreeModule,
        FontAwesomeModule,
      ],
      providers: [
        AppStateService,
        NgbPaginationConfig,
        { provide: AppLineItemService, useValue: ocLineItemService },
        {
          provide: ActivatedRoute,
          useValue: { queryParams, snapshot: { queryParams: mockQueryParams } },
        },
        { provide: OcMeService, useValue: ocMeService },
        { provide: FavoriteProductsService, useValue: favoriteProductsService },
        { provide: ModalService, useValue: modalService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
    appStateService = TestBed.get(AppStateService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    component.categoryCrumbs = [];
    component.isModalOpen = true;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      spyOn(component, 'getProductData').and.returnValue(mockProductData);
      spyOn(component, 'configureRouter');
      spyOn(component, 'getCategories');
      component.ngOnInit();
    });
    it('should set productList$', () => {
      expect(component.getProductData).toHaveBeenCalled();
      expect(component.productList$).toEqual(<Observable<ListBuyerProduct>>(
        mockProductData
      ));
    });
    it('should get categories', () => {
      expect(component.getCategories).toHaveBeenCalled();
    });
    it('should configure the router', () => {
      expect(component.configureRouter).toHaveBeenCalled();
    });
  });

  describe('getProductData', () => {
    beforeEach(() => {
      spyOn(component, 'buildBreadCrumbs');
      component.getProductData();
    });
    afterEach(() => {
      ocMeService.ListProducts.calls.reset();
    });
    describe('hasFavoriteProductsFilter class member', () => {
      it('should be true if query params has favoriteProducts set to true', () => {
        queryParams.next({ favoriteProducts: 'true' });
        expect(component.hasFavoriteProductsFilter).toBe(true);
      });
      it('should be false if query params does not favoriteProducts', () => {
        queryParams.next({});
        expect(component.hasFavoriteProductsFilter).toBe(false);
      });
      it('should be false if query params is anything other than true', () => {
        queryParams.next({ favoriteProducts: 'something else thats not true' });
        expect(component.hasFavoriteProductsFilter).toBe(false);
      });
    });
    describe('hasQueryParams class member', () => {
      it('should be true if queryParams is a non-empty object', () => {
        queryParams.next({ anyValue: 'true' });
        expect(component.hasQueryParams).toBe(true);
      });
      it('should be false if queryParams is an empty object', () => {
        queryParams.next({});
        expect(component.hasQueryParams).toBe(false);
      });
    });
    it('should build bread crumbs', () => {
      queryParams.next({ category: 'CategoryID' });
      expect(component.buildBreadCrumbs).toHaveBeenCalledWith('CategoryID');
    });
    describe('favorite products filter query', () => {
      const blankFilters = {
        categoryID: undefined,
        page: undefined,
        search: undefined,
        sortBy: undefined,
        filters: {
          ID: undefined,
        },
      };
      it('should add query if the query parameter favoriteProducts is set to true', () => {
        queryParams.next({ favoriteProducts: 'true' });
        const expected = { ...blankFilters, ...{ filters: { ID: 'Id1|Id2' } } };
        expect(ocMeService.ListProducts).toHaveBeenCalledWith(expected);
        queryParams.next({ favoriteProducts: 'true' });
      });
      it('should not add query if the query parameter favoriteProducts is set to false', () => {
        queryParams.next({ favoriteProducts: 'false' });
        const expected = { ...blankFilters };
        expect(ocMeService.ListProducts).toHaveBeenCalledWith(expected);
      });
      it('should not add query if the query parameter favoriteProducts is not defined', () => {
        queryParams.next({});
        const expected = { ...blankFilters };
        expect(ocMeService.ListProducts).toHaveBeenCalledWith(expected);
      });
    });
    it('should correctly set parameters for list call', () => {
      const mockQps = {
        category: 'CategoryID',
        page: '3',
        pageSize: '30',
        sortBy: 'ID',
      };
      queryParams.next(mockQps);
      expect(ocMeService.ListProducts).toHaveBeenCalledWith({
        categoryID: 'CategoryID',
        page: '3',
        search: undefined,
        sortBy: 'ID',
        filters: {
          ID: undefined,
        },
      });
    });
  });

  describe('getCategories', () => {
    beforeEach(() => {
      spyOn(component, 'buildBreadCrumbs');
      component.getCategories();
    });
    it('should list categories', () => {
      expect(ocMeService.ListCategories).toHaveBeenCalledWith({ depth: 'all' });
    });
    it('should build breadcrumbs with categoryid from queryparam', () => {
      expect(component.buildBreadCrumbs).toHaveBeenCalledWith(
        component['activatedRoute'].snapshot.queryParams.category
      );
    });
  });

  describe('clearAllFilters', () => {
    beforeEach(() => {
      spyOn((component as any).router, 'navigate');
      component.clearAllFilters();
    });
    it('should reload state with no query parameters', () => {
      expect(component['router'].navigate).toHaveBeenCalledWith([]);
    });
  });

  describe('changePage', () => {
    const mockPage = 2;
    it('should reload state with page set as query params', () => {
      const navigateSpy = spyOn((<any>component).router, 'navigate');
      component.changePage(mockPage);
      queryParams.next({ mockQueryParams });
      const newQueryParams = Object.assign({ page: mockPage }, mockQueryParams);
      expect(navigateSpy).toHaveBeenCalledWith([], {
        queryParams: newQueryParams,
      });
    });
  });

  describe('changeCategory', () => {
    const mockCategory = 'category2';
    it('should reload state with category set as query params', () => {
      const navigateSpy = spyOn((<any>component).router, 'navigate');
      component.changeCategory(mockCategory);
      expect(modalService.close).toHaveBeenCalled();
      const newQueryParams = Object.assign({ category: mockCategory });
      queryParams.next({ newQueryParams });

      expect(navigateSpy).toHaveBeenCalledWith([], {
        queryParams: newQueryParams,
      });
    });
  });

  describe('changeSortStrategy', () => {
    beforeEach(() => {
      spyOn(component as any, 'addQueryParam');
    });
    it('should call addQueryParam with new "sortBy" ', () => {
      component.changeSortStrategy(ProductSortStrategy.ID);
      expect(component['addQueryParam']).toHaveBeenCalledWith({
        sortBy: ProductSortStrategy.ID,
      });
    });
  });

  describe('buildBreadCrumbs', () => {
    it('should return an empty array when id is null', () => {
      expect(component.buildBreadCrumbs(null)).toEqual([]);
    });
    it('should return an empty array when categories are null', () => {
      component.categories = null;
      expect(component.buildBreadCrumbs('CategoryID')).toEqual([]);
    });
    it('should return a single crumb if no parentID', () => {
      component.categories = { Items: [{ ID: 'CategoryID' }] };
      expect(component.buildBreadCrumbs('CategoryID')).toEqual([
        { ID: 'CategoryID' },
      ]);
    });
    it('should build a long list of crumbs in correct order', () => {
      component.categories = {
        Items: [
          { ID: 'a', ParentID: 'b' },
          { ID: 'b', ParentID: 'c' },
          { ID: 'c' },
          { ID: 'd' },
        ],
      };
      expect(component.buildBreadCrumbs('a')).toEqual([
        { ID: 'c' },
        { ID: 'b', ParentID: 'c' },
        { ID: 'a', ParentID: 'b' },
      ]);
    });
  });

  describe('addToCart', () => {
    const mockEvent = { product: { ID: 'MockProduct' }, quantity: 3 };
    beforeEach(() => {
      spyOn(appStateService.addToCartSubject, 'next');
      component.addToCart(mockEvent);
    });
    it('should call ocLineItemService.Create', () => {
      expect(ocLineItemService.create).toHaveBeenCalledWith(
        mockEvent.product,
        mockEvent.quantity
      );
    });
    it('should call AppStateService.addToCartEvent', () => {
      expect(appStateService.addToCartSubject.next).toHaveBeenCalledWith(
        mockEvent
      );
    });
  });
});
