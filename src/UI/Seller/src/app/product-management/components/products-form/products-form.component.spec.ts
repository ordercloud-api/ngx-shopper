import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductsFormComponent } from './products-form.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { AppFormErrorService } from '@app-seller/shared';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserModule } from '@angular/platform-browser';

describe('ProductsFormComponent', () => {
  let component: ProductsFormComponent;
  let fixture: ComponentFixture<ProductsFormComponent>;

  const mockProduct = {
    ID: '1',
    Name: 'Products',
    Description: 'Description',
    Active: true,
    xp: { Featured: false },
  };

  const formErrorService = {
    hasRequiredError: jasmine.createSpy('hasRequiredError'),
    displayFormErrors: jasmine.createSpy('displayFormErrors'),
    hasInvalidIdError: jasmine.createSpy('hasInvalidIdError'),
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProductsFormComponent],
      imports: [ReactiveFormsModule, RouterTestingModule, BrowserModule],
      providers: [
        FormBuilder,
        { provide: AppFormErrorService, useValue: formErrorService },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsFormComponent);
    component = fixture.componentInstance;
    component.existingProduct = mockProduct;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should initialize form correctly', () => {
      expect(component.productForm.value).toEqual({
        ID: '1',
        Name: 'Products',
        Description: 'Description',
        Active: true,
        Featured: false,
      });
    });
  });

  describe('onSubmit', () => {
    beforeEach(() => {
      spyOn(component.formSubmitted, 'emit');
    });
    it('should call displayFormErrors if form is invalid', () => {
      component.productForm.setErrors({ test: true });
      component['onSubmit']();
      expect(formErrorService.displayFormErrors).toHaveBeenCalled();
    });
    it('should emit formSubmitted event', () => {
      component['onSubmit']();
      expect(component.formSubmitted.emit).toHaveBeenCalledWith({
        ...mockProduct,
        Featured: false,
      });
    });
  });

  describe('hasRequiredError', () => {
    beforeEach(() => {
      component['hasRequiredError']('FirstName');
    });
    it('should call formErrorService.hasRequiredError', () => {
      expect(formErrorService.hasRequiredError).toHaveBeenCalledWith(
        'FirstName',
        component.productForm
      );
    });
  });
});
