import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderListComponent } from '@app-buyer/order/components/order-list/order-list.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import {
  NgbPaginationModule,
  NgbDateAdapter,
  NgbDateParserFormatter,
} from '@ng-bootstrap/ng-bootstrap';
import {
  NgbDateNativeAdapter,
  NgbDateCustomParserFormatter,
} from '@app-buyer/config/date-picker.config';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { FavoriteOrdersService } from '@app-buyer/shared/services/favorites/favorites.service';

describe('OrderListComponent', () => {
  let component: OrderListComponent;
  let fixture: ComponentFixture<OrderListComponent>;

  const favoriteOrdersService = {
    loadFavorites: jasmine.createSpy('loadFavorites').and.returnValue(of(null)),
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FaIconComponent, OrderListComponent],
      imports: [NgbPaginationModule],
      providers: [
        { provide: NgbDateAdapter, useClass: NgbDateNativeAdapter },
        {
          provide: NgbDateParserFormatter,
          useClass: NgbDateCustomParserFormatter,
        },
        { provide: FavoriteOrdersService, useValue: favoriteOrdersService },
      ],
      schemas: [NO_ERRORS_SCHEMA], // Ignore template errors: remove if tests are added to test template
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderListComponent);
    component = fixture.componentInstance;
    component.orders = {
      Items: [],
      Meta: { TotalCount: 0, TotalPages: 0, Page: 1, PageSize: 25 },
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call loadFavorites', () => {
      component.ngOnInit();
      expect(favoriteOrdersService.loadFavorites).toHaveBeenCalled();
    });
  });

  describe('updateSort', () => {
    beforeEach(() => {
      spyOn(component.updatedSort, 'emit');
    });
    it('should emit negative filter if sortBy is set to value', () => {
      component.sortBy = 'ID';
      component['updateSort']('ID');
      expect(component.updatedSort.emit).toHaveBeenCalledWith('!ID');
    });
    it('should emit undefined if sortBy is set to negative value', () => {
      component.sortBy = '!ID';
      component['updateSort']('ID');
      expect(component.updatedSort.emit).toHaveBeenCalledWith(undefined);
    });
    it('should emit value if passed in value neither matches sortBy or is a negation of sortBy', () => {
      component.sortBy = 'SomethingElse';
      component['updateSort']('ID');
      expect(component.updatedSort.emit).toHaveBeenCalledWith('ID');
    });
    it('should emit value if sortBy is null', () => {
      component.sortBy = null;
      component['updateSort']('ID');
      expect(component.updatedSort.emit).toHaveBeenCalledWith('ID');
    });
  });

  describe('changePage', () => {
    beforeEach(() => {
      spyOn(component.changedPage, 'emit');
      component['changePage'](2);
    });
    it('should emit passed in page', () => {
      expect(component.changedPage.emit).toHaveBeenCalledWith(2);
    });
  });
});
