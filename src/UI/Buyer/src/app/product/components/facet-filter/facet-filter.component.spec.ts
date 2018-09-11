import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacetFilterComponent } from './facet-filter.component';
import { FacetListComponent } from '@app-buyer/product/components/facet-list/facet-list.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

describe('FacetFilterComponent', () => {
  let component: FacetFilterComponent;
  let fixture: ComponentFixture<FacetFilterComponent>;
  const activatedRoute = {
    queryParams: new Subject(),
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [FacetFilterComponent, FacetListComponent, FaIconComponent],
      imports: [ReactiveFormsModule, NgbCollapseModule],
      providers: [{ provide: ActivatedRoute, useValue: activatedRoute }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacetFilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      spyOn(component as any, 'onQueryParamChange');
      component.ngOnInit();
    });
    it('should subscribe to query params', () => {
      expect(component['onQueryParamChange']).toHaveBeenCalled();
    });
  });

  describe('onQueryParamChange', () => {
    beforeEach(() => {
      spyOn(component as any, 'findActiveFacets').and.returnValue(['Color']);
    });
    it('should set query params to component state', () => {
      activatedRoute.queryParams.next({ Color: 'Red' });
      component['onQueryParamChange']();
      expect(component.queryParams).toEqual({ Color: 'Red' });
    });
    it('should find active facets', () => {
      activatedRoute.queryParams.next({ Color: 'Red' });
      component['onQueryParamChange']();
      expect(component['findActiveFacets']).toHaveBeenCalled();
      expect(component.activeFacets).toEqual(['Color']);
    });
  });

  describe('findActiveFacets', () => {
    it('should return an empty array if query params are empty', () => {
      component.facetList = [{ Name: 'Color' }, { Name: 'Size' }];
      const result = component['findActiveFacets']({});
      expect(result).toEqual([]);
    });
    it('should return empty array if facetList is empty', () => {
      component.facetList = [];
      const result = component['findActiveFacets']({
        Color: 'Red',
        Size: 'Large',
      });
      expect(result).toEqual([]);
    });
    it('should return only facets that are in the facet list and in the query parameters', () => {
      component.facetList = [{ Name: 'Color' }, { Name: 'Size' }];
      const result = component['findActiveFacets']({
        Color: 'Red',
        Size: 'Large',
        NotAFacet: 'blah',
      });
      expect(result).toEqual(['Color', 'Size']);
    });
  });

  describe('ngOnDestroy', () => {
    beforeEach(() => {
      component.alive = true;
      component['ngOnDestroy']();
    });
    it('should set alive to false', () => {
      component.alive = false;
    });
  });
});
