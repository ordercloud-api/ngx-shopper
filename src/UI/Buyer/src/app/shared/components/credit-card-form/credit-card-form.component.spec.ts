import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditCardFormComponent } from '@app-buyer/shared/components/credit-card-form/credit-card-form.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { AppFormErrorService } from '@app-buyer/shared';

describe('CreditCardFormComponent', () => {
  let component: CreditCardFormComponent;
  let fixture: ComponentFixture<CreditCardFormComponent>;
  const thisYear = new Date().getFullYear();
  const formErrorService = {
    hasRequiredError: jasmine.createSpy('hasRequiredError'),
    displayFormErrors: jasmine.createSpy('displayFormErrors'),
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CreditCardFormComponent],
      imports: [FontAwesomeModule, ReactiveFormsModule],
      providers: [{ provide: AppFormErrorService, useValue: formErrorService }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditCardFormComponent);
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
    it('should set the form values to corect defaults', () => {
      expect(component.cardForm.value).toEqual({
        CardNumber: '',
        CardholderName: '',
        expMonth: '01',
        expYear: `${thisYear}`.slice(-2),
        CardCode: '',
      });
    });
    it('should set month dropdown options correctly', () => {
      expect(component.monthOptions[0]).toEqual('01');
      expect(component.monthOptions[11]).toEqual('12');
      expect(component.monthOptions.length).toEqual(12);
    });
    it('should set year dropdown options correctly', () => {
      expect(component.yearOptions[0]).toEqual(`${thisYear}`);
      expect(component.yearOptions[19]).toEqual(`${thisYear + 19}`);
      expect(component.yearOptions.length).toEqual(20);
    });
  });

  describe('onSubmit', () => {
    beforeEach(() => {
      component.cardForm.setValue({
        CardNumber: 'xxxx',
        CardholderName: 'test',
        expMonth: '02',
        expYear: '18',
        CardCode: 'xxx',
      });
    });
    it('should call displayFormErrors if form is invalid', () => {
      component.cardForm.setErrors({ test: true });
      component['onSubmit']();
      expect(formErrorService.displayFormErrors).toHaveBeenCalled();
    });
    it('should emit the correct value', () => {
      spyOn(component.formSubmitted, 'emit');
      component.onSubmit();
      fixture.detectChanges();

      expect(component.formSubmitted.emit).toHaveBeenCalledWith({
        CardNumber: 'xxxx',
        CardholderName: 'test',
        ExpirationDate: '0218',
        CardCode: 'xxx',
      });
    });
  });
});
