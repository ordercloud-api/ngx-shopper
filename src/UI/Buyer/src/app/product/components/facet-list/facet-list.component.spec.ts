import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacetListComponent } from './facet-list.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

describe('FacetListComponent', () => {
  let component: FacetListComponent;
  let fixture: ComponentFixture<FacetListComponent>;
  const activatedRoute = { queryParams: new Subject() };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FacetListComponent, FaIconComponent],
      imports: [ReactiveFormsModule, NgbCollapseModule],
      providers: [{ provide: ActivatedRoute, useValue: activatedRoute }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacetListComponent);
    component = fixture.componentInstance;
    component.facet = {
      Name: 'Color',
      Values: [{ Value: 'Red', Count: 5 }, { Value: 'Blue', Count: 10 }],
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      spyOn(component as any, 'setForm');
      component.ngOnInit();
    });
    it('should set form', () => {
      expect(component['setForm']).toHaveBeenCalled();
    });
  });

  describe('setForm', () => {
    beforeEach(() => {
      spyOn(component as any, 'makeBlankForm');
      spyOn(component as any, 'setValuesOnForm');
      component['setForm']();
    });
    it('should make a blank form', () => {
      expect(component['makeBlankForm']).toHaveBeenCalled();
    });
    it('should set values on form', () => {
      expect(component['setValuesOnForm']).toHaveBeenCalled();
    });
  });

  describe('makeBlankForm', () => {
    it('should create a form with all facet values set to false', () => {
      expect(component.form.value).toEqual({ facetValues: [false, false] });
    });
  });

  describe('setValuesOnForm', () => {
    it('should set query params to class state', () => {
      activatedRoute.queryParams.next({ Color: 'Red' });
      component['setValuesOnForm']();
      expect(component.queryParams).toEqual({ Color: 'Red' });
    });
    it('should handle single values', () => {
      // with red color param
      activatedRoute.queryParams.next({ Color: 'Red' });
      component['setValuesOnForm']();
      expect(component.form.value).toEqual({ facetValues: [true, false] });
    });
    it('should handle single values', () => {
      // with blue color param
      activatedRoute.queryParams.next({ Color: 'Blue' });
      component['setValuesOnForm']();
      expect(component.form.value).toEqual({ facetValues: [false, true] });
    });
    it('should handle multiple values', () => {
      activatedRoute.queryParams.next({ Color: 'Blue|Red' });
      component['setValuesOnForm']();
      expect(component.form.value).toEqual({ facetValues: [true, true] });
    });
  });

  describe('toggleFacets', () => {
    it('should set isCollapsed to true if was previously false', () => {
      component.isCollapsed = false;
      component.toggleFacets();
      expect(component.isCollapsed).toBe(true);
    });
    it('should set isCollapsed to false if was previously true', () => {
      component.isCollapsed = true;
      component.toggleFacets();
      expect(component.isCollapsed).toBe(false);
    });
    it('should set visibleFacetLength to 5 if facets were just toggled on', () => {
      component.visibleFacetLength = 12;
      component.isCollapsed = false;
      component.toggleFacets();
      expect(component.visibleFacetLength).toBe(5);
    });
  });

  describe('showMore', () => {
    it('should show all facets', () => {
      component.facet.Values = [{}, {}, {}, {}, {}, {}, {}];
      expect(component.visibleFacetLength).toEqual(5);
      component.showMore();
      expect(component.visibleFacetLength).toBe(7);
    });
  });

  describe('selectFacet', () => {
    beforeEach(() => {
      spyOn(component.selectedFacet, 'emit');
    });
    describe('facet filter already exists', () => {
      describe('facet was select', () => {
        it('should add |FACET_VALUE to existing filter', () => {
          component.queryParams = { Color: 'Blue' };
          component.selectFacet('Color', 'Red', 0);
          expect(component.selectedFacet.emit).toHaveBeenCalledWith({
            Color: 'Blue|Red',
          });
        });
      });
      describe('facet was unselected', () => {
        describe('multiple existing facet values', () => {
          it('should remove facet from filter', () => {
            component.form.controls.facetValues.setValue([true, true]);
            component.queryParams = { Color: 'Blue|Red' };
            component.selectFacet('Color', 'Blue', 0);
            expect(component.selectedFacet.emit).toHaveBeenCalledWith({
              Color: 'Red',
            });
          });
        });
        describe('one existing facet value', () => {
          it('should set facet to undefined so sdk ignores', () => {
            component.form.controls.facetValues.setValue([true, false]);
            component.queryParams = { Color: 'Blue' };
            component.selectFacet('Color', 'Blue', 0);
            expect(component.selectedFacet.emit).toHaveBeenCalledWith({
              Color: undefined,
            });
          });
        });
      });
    });
    describe('facet filter does not already exist', () => {
      beforeEach(() => {
        component.queryParams = {};
      });
      describe('facet was selected', () => {
        it('should create facet filter', () => {
          component.form.controls.facetValues.setValue([false, false]);
          component.selectFacet('Color', 'Blue', 0);
          expect(component.selectedFacet.emit).toHaveBeenCalledWith({
            Color: 'Blue',
          });
        });
      });
    });
  });
});
