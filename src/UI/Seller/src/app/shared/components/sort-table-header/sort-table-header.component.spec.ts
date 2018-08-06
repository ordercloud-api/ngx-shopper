import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SortTableHeaderComponent } from './sort-table-header.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('SortTableHeaderComponent', () => {
  let component: SortTableHeaderComponent;
  let fixture: ComponentFixture<SortTableHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SortTableHeaderComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SortTableHeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('changeSort', () => {
    beforeEach(() => {
      spyOn(component.sort, 'emit');
      component.fieldName = 'ID';
    });
    it('should sort accending if first click', () => {
      component.currentSort = undefined;
      component.changeSort();
      expect(component.sort.emit).toHaveBeenCalledWith('ID');
    });
    it('should sort descending if second click', () => {
      component.currentSort = 'ID';
      component.changeSort();
      expect(component.sort.emit).toHaveBeenCalledWith('!ID');
    });
    it('should clear sort if third click', () => {
      component.currentSort = '!ID';
      component.changeSort();
      expect(component.sort.emit).toHaveBeenCalledWith(undefined);
    });
  });
});
