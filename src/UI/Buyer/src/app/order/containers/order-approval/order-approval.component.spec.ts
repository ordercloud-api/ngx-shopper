import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { OrderAprovalComponent } from '@app-buyer/order/containers/order-approval/order-approval.component';


describe('OrderAprovalComponent', () => {
  let component: OrderAprovalComponent;
  let fixture: ComponentFixture<OrderAprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderAprovalComponent ]
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
});
