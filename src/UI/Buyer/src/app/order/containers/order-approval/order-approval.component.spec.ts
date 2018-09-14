import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderApprovalComponent } from './order-approval.component';

describe('OrderApprovalComponent', () => {
  let component: OrderApprovalComponent;
  let fixture: ComponentFixture<OrderApprovalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderApprovalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderApprovalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
