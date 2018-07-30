import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { OrderAprovalComponent } from '@app-buyer/order/containers/order-approval/order-approval.component';
import { Subject, of } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbPaginationModule, NgbRootModule } from '@ng-bootstrap/ng-bootstrap';
import { DatePipe } from '@angular/common';
import { MeService } from '@ordercloud/angular-sdk';
import { Router, ActivatedRoute, convertToParamMap } from '@angular/router';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { take } from 'rxjs/operators';


describe('OrderAprovalComponent', () => {
  let component: OrderAprovalComponent;
  let fixture: ComponentFixture<OrderAprovalComponent>;
  const mockMe = { xp: { FavoriteOrders: ['a', 'b', 'c'] } };
  const meService = {
    ListApprovableOrders: jasmine.createSpy('ListApprovableOrders').and.returnValue(of(null)),
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
      declarations: [ OrderAprovalComponent ],
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
    fixture = TestBed.createComponent(OrderAprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      spyOn(component as any, 'listOrders');
      component.ngOnInit();
    });
    it('should call list orders', () => {
      expect(component['listOrders']).toHaveBeenCalled();
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
        datesubmitted: ['5-30-18'],
      }
    };
    beforeEach(() => {
      meService.ListApprovableOrders.calls.reset();
    });
    it('should call meService.ListApprovableOrders with correct parameters', () => {
      component['listOrders']().pipe(take(1)).subscribe(() => {
        expect(meService.ListApprovableOrders).toHaveBeenCalledWith(expected);
      });
      queryParamMap.next(convertToParamMap(activatedRoute.snapshot.queryParams));
    });
  });
});
