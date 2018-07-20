import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute, convertToParamMap } from '@angular/router';

import { OrderHistoryComponent } from '@app/order/containers/order-history/order-history.component';
import { SearchComponent } from '@app/shared/components/search/search.component';
import { StatusFilterComponent } from '@app/order/components/status-filter/status-filter.component';
import { DateFilterComponent } from '@app/order/components/date-filter/date-filter.component';
import { OrderListComponent } from '@app/order/components/order-list/order-list.component';

import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { NgbPaginationModule, NgbRootModule } from '@ng-bootstrap/ng-bootstrap';
import { MeService, OrderService } from '@ordercloud/angular-sdk';
import { DatePipe } from '@angular/common';
import { OrderStatus } from '@app/order/models/order-status.model';
import { of, Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { OrderStatusDisplayPipe } from '@app/shared/pipes/order-status-display/order-status-display.pipe';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('OrderHistoryComponent', () => {
  let component: OrderHistoryComponent;
  let fixture: ComponentFixture<OrderHistoryComponent>;

  const mockMe = { xp: { FavoriteOrders: ['a', 'b', 'c'] } };
  const meService = {
    ListOrders: jasmine.createSpy('ListOrders').and.returnValue(of(null)),
    Get: jasmine.createSpy('Get').and.returnValue(of(mockMe)),
    Patch: jasmine.createSpy('Patch').and.returnValue(of(mockMe))
  };
  const router = { navigate: jasmine.createSpy('navigate') };
  const queryParamMap = new Subject<any>();
  const activatedRoute = {
    snapshot: {
      queryParams: {
        sortBy: '!ID',
        search: 'OrderID123',
        page: 1,
        status: 'Open',
        datesubmitted: ['5-30-18'],
      }
    },
    queryParamMap
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        OrderListComponent,
        DateFilterComponent,
        StatusFilterComponent,
        FaIconComponent,
        SearchComponent,
        OrderHistoryComponent,
        OrderStatusDisplayPipe,
      ],
      imports: [
        ReactiveFormsModule,
        NgbPaginationModule,
        NgbRootModule,
      ],
      providers: [
        DatePipe,
        { provide: MeService, useValue: meService },
        { provide: Router, useValue: router },
        { provide: ActivatedRoute, useValue: activatedRoute },
      ],
      schemas: [NO_ERRORS_SCHEMA], // Ignore template errors: remove if tests are added to test template
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      spyOn(component as any, 'listOrders');
      spyOn(component as any, 'listFavoriteOrders').and.returnValue(of({}));
      component.ngOnInit();
    });
    it('should call list orders', () => {
      expect(component['listOrders']).toHaveBeenCalled();
      expect(component['listFavoriteOrders']).toHaveBeenCalled();
    });
  });

  describe('sortOrders', () => {
    it('should navigate to same route with updated sort params', () => {
      component['sortOrders']('Name');
      const queryParams = { ...activatedRoute.snapshot.queryParams, sortBy: 'Name' };
      expect(router.navigate).toHaveBeenCalledWith([], { queryParams });
    });
  });

  describe('changePage', () => {
    it('should navigate to same route with updated page params', () => {
      component['changePage'](2);
      const queryParams = { ...activatedRoute.snapshot.queryParams, page: 2 };
      expect(router.navigate).toHaveBeenCalledWith([], { queryParams });
    });
  });

  describe('filterBySearch', () => {
    it('should navigate to same route with updated search params', () => {
      component['filterBySearch']('another search term');
      const queryParams = { ...activatedRoute.snapshot.queryParams, search: 'another search term', page: undefined };
      expect(router.navigate).toHaveBeenCalledWith([], { queryParams });
    });
  });

  describe('filterByStatus', () => {
    it('should navigate to same route with updated status params', () => {
      component['filterByStatus'](OrderStatus.Completed);
      const queryParams = { ...activatedRoute.snapshot.queryParams, status: OrderStatus.Completed };
      expect(router.navigate).toHaveBeenCalledWith([], { queryParams });
    });
  });

  describe('filterByDate', () => {
    it('should navigate to same route with updated status params', () => {
      component['filterByDate'](['5-30-18']);
      const queryParams = { ...activatedRoute.snapshot.queryParams, datesubmitted: ['5-30-18'] };
      expect(router.navigate).toHaveBeenCalledWith([], { queryParams });
    });
  });

  describe('listOrders', () => {
    const expected = {
      sortBy: '!ID',
      search: 'OrderID123',
      page: 1,
      filters: {
        status: 'Open',
        datesubmitted: ['5-30-18'],
        ID: undefined
      }
    };
    beforeEach(() => {
      meService.ListOrders.calls.reset();
    });
    it('should call meService.ListOrders with correct parameters', () => {
      component['listOrders']().pipe(take(1)).subscribe(() => {
        expect(meService.ListOrders).toHaveBeenCalledWith(expected);
      });
      queryParamMap.next(convertToParamMap(activatedRoute.snapshot.queryParams));
    });
  });

  describe('listFavoriteOrders', () => {
    beforeEach(() => {
      meService.Get.calls.reset();
    });
    it('should call meService.get', () => {
      component['listFavoriteOrders']().pipe(take(1)).subscribe(results => {
        expect(results).toEqual(mockMe.xp.FavoriteOrders);
        expect(meService.Get).toHaveBeenCalled();
      });
    });
  });

  describe('updateFavorite', () => {
    it('should remove fav correctly', () => {
      component.favoriteOrders = ['a', 'b'];
      component['updateFavorite'](false, 'a');
      expect(meService.Patch).toHaveBeenCalledWith({ xp: { FavoriteOrders: ['b'] } });
    });
    it('should add fav correctly', () => {
      component.favoriteOrders = ['a', 'b'];
      component['updateFavorite'](true, 'c');
      expect(meService.Patch).toHaveBeenCalledWith({ xp: { FavoriteOrders: ['a', 'b', 'c'] } });
    });
  });

  describe('filterByFavorite', () => {
    beforeEach(() => {
      meService.ListOrders.calls.reset();
    });
    it('should show favorites only when true', () => {
      component['filterByFavorite'](true);
      expect(component.showfavoritesOnly).toEqual(true);
    });
    it('should show all products when false', () => {
      component['filterByFavorite'](false);
      expect(component.showfavoritesOnly).toEqual(false);
    });
  });
});
