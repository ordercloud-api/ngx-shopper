import {
  async,
  ComponentFixture,
  TestBed,
  tick,
  fakeAsync,
} from '@angular/core/testing';

import { QuantityInputComponent } from '@app-buyer/shared/components/quantity-input/quantity-input.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AppFormErrorService } from '@app-buyer/shared/services/form-error/form-error.service';

describe('QuantityInputComponent', () => {
  let component: QuantityInputComponent;
  let fixture: ComponentFixture<QuantityInputComponent>;
  const toastrService = {
    error: jasmine.createSpy('error').and.returnValue(null),
  };
  const appFormErrorService = {
    getProductQuantityError: jasmine
      .createSpy('getProductQuantityError')
      .and.returnValue({ message: 'error' }),
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [QuantityInputComponent],
      imports: [ReactiveFormsModule],
      providers: [
        { provide: ToastrService, useValue: toastrService },
        { provide: AppFormErrorService, useValue: appFormErrorService },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(QuantityInputComponent);
    component = fixture.componentInstance;
    component.product = {
      ID: '3HQ_lazyboy',
      Name: 'Lazyboy Recliner',
      PriceSchedule: {
        MinQuantity: 5,
      },
    };
    component.existingQty = 3;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      component.ngOnInit();
    });
    it('should set the form', () => {
      expect(component.form.value).toEqual({
        quantity: 3,
      });
    });
  });

  describe('quantityChanged', () => {
    beforeEach(() => {
      spyOn(component.qtyChanged, 'emit');
      component.alive = true;
      component.ngOnInit();
    });
    it(
      'should emit qtyChanged event if form is valid and quantity is a number ',
      fakeAsync(() => {
        component.form.setErrors({});
        component.form.controls['quantity'].setValue(6);
        tick(499);
        expect(component.qtyChanged.emit).not.toHaveBeenCalled();
        tick(500);
        expect(component.qtyChanged.emit).toHaveBeenCalled();
      })
    );
    it('should not emit if form is invalid', () => {
      // min qty is set to 5 so this should be invalid
      component.form.controls['quantity'].setValue(2);
      expect(component.qtyChanged.emit).not.toHaveBeenCalled();
    });
    it('should not emit is quantity is not a number', () => {
      component.form.setErrors({});
      component.form.controls['quantity'].setValue('abc');
      expect(component.qtyChanged.emit).not.toHaveBeenCalled();
    });
  });

  describe('addToCart', () => {
    beforeEach(() => {
      spyOn(component.addedToCart, 'emit');
    });
    it('should emit addedToCart event if form is valid', () => {
      component.form.controls['quantity'].setValue(6);
      component.addToCart({ stopPropagation: () => {} });
      expect(component.addedToCart.emit).toHaveBeenCalledWith({
        product: component.product,
        quantity: 6,
      });
    });
    it('should not emit addedToCart if form is valid', () => {
      component.form.controls['quantity'].setValue(3);
      component.addToCart({ stopPropagation: () => {} });
      expect(component.addedToCart.emit).not.toHaveBeenCalled();
      expect(toastrService.error).toHaveBeenCalled();
    });
  });
});
