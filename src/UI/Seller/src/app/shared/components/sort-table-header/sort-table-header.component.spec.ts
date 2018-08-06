import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SortTableHeaderComponent } from './sort-table-header.component';

describe('SortTableHeaderComponent', () => {
  let component: SortTableHeaderComponent;
  let fixture: ComponentFixture<SortTableHeaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SortTableHeaderComponent],
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
});
