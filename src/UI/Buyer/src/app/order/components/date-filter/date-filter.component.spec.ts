import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { DateFilterComponent } from '@app/order/components/date-filter/date-filter.component';
import { ReactiveFormsModule } from '@angular/forms';
import {
  NgbCalendar, NgbDateParserFormatter,
  NgbDateAdapter,
  NgbRootModule
} from '@ng-bootstrap/ng-bootstrap';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { DatePipe } from '@angular/common';
import { NgbDateNativeAdapter, NgbDateCustomParserFormatter } from '@app/config/date-picker.config';

describe('DateFilterComponent', () => {
  let component: DateFilterComponent;
  let fixture: ComponentFixture<DateFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        DateFilterComponent,
        FaIconComponent,
      ],
      imports: [
        NgbRootModule,
        ReactiveFormsModule,
      ],
      providers: [
        DatePipe,
        { provide: NgbDateAdapter, useClass: NgbDateNativeAdapter },
        { provide: NgbDateParserFormatter, useClass: NgbDateCustomParserFormatter },
      ],
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DateFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      spyOn(component as any, 'onFormChanges');
      component.ngOnInit();
    });
    it('should initialize form', () => {
      expect(component.form.value).toEqual({
        fromDate: null,
        toDate: null
      });
    });
    it('should call onFormChanges', () => {
      expect(component['onFormChanges']).toHaveBeenCalled();
    });
  });

  describe('onFormChanges', () => {
    beforeEach(() => {
      spyOn(component as any, 'emitDate');
    });
    it('should call emitData after 500ms', fakeAsync(() => {
      component['onFormChanges']();
      component.form.controls['fromDate'].setValue('08-09-2018');
      tick(499);
      expect(component['emitDate']).not.toHaveBeenCalled();
      tick(1);
      expect(component['emitDate']).toHaveBeenCalled();
    }));
  });

  describe('emitDate', () => {
    beforeEach(() => {
      spyOn(component.selectedDate, 'emit');
    });
    it('should not run if fromDate is invalid', () => {
      component.form.controls['fromDate'].setErrors({ 'test': true });
      component['emitDate']();
      expect(component.selectedDate.emit).not.toHaveBeenCalled();
    });
    it('should not run if toDate is invalid', () => {
      component.form.controls['toDate'].setErrors({ 'test': true });
      component['emitDate']();
      expect(component.selectedDate.emit).not.toHaveBeenCalled();
    });
    it('should emit array with two values if fromDate and toDate are defined', () => {
      component.form.controls['fromDate'].setValue(new Date(2018, 4, 20));
      component.form.controls['toDate'].setValue(new Date(2018, 4, 31));
      component['emitDate']();
      expect(component.selectedDate.emit).toHaveBeenCalledWith(['>5-20-18', '<5-31-18']);
    });
    it('should emit array with fromDate if only fromDate is defined', () => {
      component.form.controls['fromDate'].setValue(new Date(2018, 4, 20));
      component['emitDate']();
      expect(component.selectedDate.emit).toHaveBeenCalledWith(['>5-20-18']);
    });
    it('should emit array with toDate if only toDate is defined', () => {
      component.form.controls['toDate'].setValue(new Date(2018, 4, 31));
      component['emitDate']();
      expect(component.selectedDate.emit).toHaveBeenCalledWith(['<5-31-18']);
    });
  });

  describe('ngOnDestroy', () => {
    it('should set alive to false', () => {
      expect(component['alive']).toBe(true);
      component.ngOnDestroy();
      expect(component['alive']).toBe(false);
    });
  });
});
