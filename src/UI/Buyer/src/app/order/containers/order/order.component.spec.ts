import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderComponent } from '@app/order/containers/order/order.component';
import { RouterTestingModule } from '@angular/router/testing';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

describe('OrderComponent', () => {
  let component: OrderComponent;
  let fixture: ComponentFixture<OrderComponent>;
  const dataSubject = new Subject<any>();
  const activatedRoute = { data: dataSubject };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        FaIconComponent,
        OrderComponent
      ],
      imports: [
        RouterTestingModule
      ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRoute }
      ]
    })
      .compileComponents();
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
      component.order$.subscribe(order => {
        expect(order).toEqual({ ID: 'mockOrderID' });
      });
      dataSubject.next({ orderResolve: { order: { ID: 'mockOrderID' } } });
    });
  });
});
