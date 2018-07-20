import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LineItemCardComponent } from '@app/shared/components/line-item-card/line-item-card.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterTestingModule } from '@angular/router/testing';

import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { QuantityInputComponent } from '@app/shared/components/quantity-input/quantity-input.component';
import { ToastrModule, ToastrService } from 'ngx-toastr';


describe('LineItemCardComponent', () => {
  let component: LineItemCardComponent;
  let fixture: ComponentFixture<LineItemCardComponent>;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        LineItemCardComponent,
        QuantityInputComponent,
      ],
      imports: [
        FontAwesomeModule,
        RouterTestingModule,
        ReactiveFormsModule,
        ToastrModule.forRoot(),
      ],
      providers: [
        FormBuilder,
        ToastrService
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    const mockLineItem = { UnitPrice: 10, Quantity: 1, LineTotal: 10, Product: { name: 'test', ID: 0, unitsOnHand: 2 } };
    const mockProduct = { PriceSchedule: {} };
    fixture = TestBed.createComponent(LineItemCardComponent);
    component = fixture.componentInstance;
    component.lineitem = <any>mockLineItem;
    component.productDetails = mockProduct;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should have LineItem input', () => {
    expect(component.lineitem).toBeTruthy();
  });

  describe('deleteLineItem', () => {
    beforeEach(() => {
      spyOn(component.deletedLineItem, 'emit');
      component['deleteLineItem']();
    });
    it('should emit deletedLineItem', () => {
      expect(component.deletedLineItem.emit).toHaveBeenCalledWith(component.lineitem);
    });
  });

  describe('updateQuantity', () => {
    beforeEach(() => {
      spyOn(component.lineItemUpdated, 'emit');
    });
    it('should emit lineItemUpdated if quantity is valid', () => {
      component['updateQuantity'](10);
      expect(component.lineItemUpdated.emit).toHaveBeenCalled();
    });
  });

  it('should display readonly version correctly', () => {
    component.readOnly = true;
    fixture.detectChanges();
    const quantityInput = fixture.nativeElement.querySelector('add-to-cart-form');
    const deleteBtn = fixture.nativeElement.querySelector('.delete-lineitem');
    expect(quantityInput).toBeNull();
    expect(deleteBtn).toBeNull();
  });
});
