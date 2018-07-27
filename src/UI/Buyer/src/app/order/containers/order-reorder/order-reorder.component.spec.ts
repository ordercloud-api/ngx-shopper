import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderReorderComponent } from '@app-buyer/order/containers/order-reorder/order-reorder.component';

describe('OrderReorderComponent', () => {
  let component: OrderReorderComponent;
  let fixture: ComponentFixture<OrderReorderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderReorderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderReorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('call modalService.open', ()=>{

  })
  
  it('call ocLineItemService.Create for each valid line item', () =>{

  })

  it('call modalService.close', () => {

  })

});
