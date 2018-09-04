import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderComponent } from '@app-buyer/order/containers/order/order.component';
import { RouterTestingModule } from '@angular/router/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { FavoriteOrdersService } from '@app-buyer/shared/services/favorites/favorites.service';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('OrderComponent', () => {
  let component: OrderComponent;
  let fixture: ComponentFixture<OrderComponent>;
  const dataSubject = new Subject<any>();
  const activatedRoute = { data: dataSubject };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FaIconComponent, OrderComponent],
      imports: [RouterTestingModule],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: FavoriteOrdersService, useValue: {} },
      ],
      schemas: [NO_ERRORS_SCHEMA], // Ignore template errors: remove if tests are added to test template
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      component.ngOnInit();
    });
    it('should set order to data from resolve', () => {
      component.order$.subscribe((order) => {
        expect(order).toEqual({ ID: 'mockOrderID' });
      });
      dataSubject.next({ orderResolve: { order: { ID: 'mockOrderID' } } });
    });
  });
});
