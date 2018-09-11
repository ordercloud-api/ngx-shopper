import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SortFilterComponent } from './sort-filter.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MapToIterablePipe } from '@app-buyer/shared/pipes/map-to-iterable/map-to-iterable.pipe';
import {
  applicationConfiguration,
  AppConfig,
} from '@app-buyer/config/app.config';
import { InjectionToken } from '@angular/core';

describe('SortFilterComponent', () => {
  let component: SortFilterComponent;
  let fixture: ComponentFixture<SortFilterComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SortFilterComponent, MapToIterablePipe],
      imports: [ReactiveFormsModule],
      providers: [
        {
          provide: applicationConfiguration,
          useValue: new InjectionToken<AppConfig>('app.config'),
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SortFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      spyOn(component as any, 'setForm');
      spyOn(component as any, 'getOptions');
      component.ngOnInit();
    });
    it('should set options', () => {
      expect(component['getOptions']).toHaveBeenCalled();
    });
    it('should set the form', () => {
      expect(component['setForm']).toHaveBeenCalled();
    });
  });

  describe('setForm', () => {
    beforeEach(() => {
      component['setForm']();
    });
    it('should initialize the form', () => {
      expect(component.form.value).toEqual({
        strategy: null,
      });
    });
  });

  describe('sortStrategyChanged', () => {
    beforeEach(() => {
      spyOn(component.sortStrategyChange, 'emit');
      component.form.controls['strategy'].setValue('!ID');
      component['sortStrategyChanged']();
    });
    it('should emit sort strategy from form', () => {
      expect(component.sortStrategyChange.emit).toHaveBeenCalledWith('!ID');
    });
  });
});
