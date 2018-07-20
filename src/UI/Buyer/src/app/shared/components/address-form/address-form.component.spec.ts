import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressFormComponent } from '@app/shared/components/address-form/address-form.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { OcGeographyService } from '@app/shared';
import { of } from 'rxjs';
import { MeService } from '@ordercloud/angular-sdk';
import { OcFormErrorService } from '@app/shared';

describe('AddressFormComponent', () => {
  let component: AddressFormComponent;
  let fixture: ComponentFixture<AddressFormComponent>;
  const meService = {
    CreateAddress: jasmine.createSpy('CreateAddress').and.returnValue(of(null)),
    PatchAddress: jasmine.createSpy('PatchAddress').and.returnValue(of(null))
  };
  const formErrorService = {
    hasRequiredError: jasmine.createSpy('hasRequiredError'),
    hasValidEmailError: jasmine.createSpy('hasValidEmailError'),
    displayFormErrors: jasmine.createSpy('displayFormErrors')
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AddressFormComponent
      ],
      imports: [
        ReactiveFormsModule,
      ],
      providers: [
        OcGeographyService,
        FormBuilder,
        { provide: OcFormErrorService, useValue: formErrorService },
        { provide: MeService, useValue: meService }
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressFormComponent);
    component = fixture.componentInstance;
    component.existingAddress = {
      ID: '',
      FirstName: 'Crhistian',
      LastName: 'Ramirez',
      Street1: '404 5th st sw',
      Street2: null,
      City: 'Minneapolis',
      State: 'MN',
      Zip: '56001',
      Phone: '555-555-5555',
      Country: 'US'
    };
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
      expect(component.addressForm.value).toEqual({
        ID: '',
        FirstName: 'Crhistian',
        LastName: 'Ramirez',
        Street1: '404 5th st sw',
        Street2: '',
        City: 'Minneapolis',
        State: 'MN',
        Zip: '56001',
        Phone: '555-555-5555',
        Country: 'US'
      });
    });
  });

  describe('onSubmit', () => {
    beforeEach(() => {
      spyOn(component.formSubmitted, 'emit');
    });
    it('should call displayFormErrors if form is invalid', () => {
      component.addressForm.setErrors({ 'test': true });
      component['onSubmit']();
      expect(formErrorService.displayFormErrors).toHaveBeenCalled();
    });
    it('should emit formSubmitted event', () => {
      component['onSubmit']();
      expect(component.formSubmitted.emit).toHaveBeenCalledWith({
        ID: '',
        FirstName: 'Crhistian',
        LastName: 'Ramirez',
        Street1: '404 5th st sw',
        Street2: '',
        City: 'Minneapolis',
        State: 'MN',
        Zip: '56001',
        Phone: '555-555-5555',
        Country: 'US',
      });
    });
  });

  describe('hasRequiredError', () => {
    beforeEach(() => {
      component['hasRequiredError']('FirstName');
    });
    it('should call formErrorService.hasRequiredError', () => {
      expect(formErrorService.hasRequiredError).toHaveBeenCalledWith('FirstName', component.addressForm);
    });
  });

  describe('hasValidEmailError', () => {
    beforeEach(() => {
      component['hasValidEmailError']();
    });
    it('should call formErrorService.hasRequiredError', () => {
      expect(formErrorService.hasValidEmailError).toHaveBeenCalledWith(component.addressForm.get('Email'));
    });
  });

});
