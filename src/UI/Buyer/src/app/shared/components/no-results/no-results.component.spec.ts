import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NoResultsComponent } from './no-results.component';

describe('NoResultsComponent', () => {
  let component: NoResultsComponent;
  let fixture: ComponentFixture<NoResultsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NoResultsComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NoResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('clear', () => {
    beforeEach(() => {
      spyOn(component.action, 'emit');
      component['clear']();
    });
    it('should emit to the parent component', () => {
      expect(component.action.emit).toHaveBeenCalled();
    });
  });
});
