import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PriceFilterComponent } from '@app/products/components/price-filter/price-filter.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { ComponentPortal } from 'ngx-toastr';

describe('PriceFilterComponent', () => {
  let component: PriceFilterComponent;
  let fixture: ComponentFixture<PriceFilterComponent>;

  const mockRoute = { snapshot: { queryParams: { pricemin: '100', pricemax: '300' } } };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PriceFilterComponent ],
      imports: [
        NgbCollapseModule,
        FontAwesomeModule,
        ReactiveFormsModule
      ],
      providers: [
        { provide: ActivatedRoute, useValue: mockRoute }
      ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PriceFilterComponent);
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
    it('should set route data correctly', () => {
      expect(component.form.get('min').value).toEqual(mockRoute.snapshot.queryParams.pricemin);
      expect(component.form.get('max').value).toEqual(mockRoute.snapshot.queryParams.pricemax);
    });
  });

  describe('setPriceFilters', () => {
    beforeEach(() => {
      spyOn(component.selectedFacet, 'emit');
    });
    it('should emit data correctely', () => {
      component.form.setValue({ min: 10, max: 100 });
      component.setPriceFilter();
      expect(component.selectedFacet.emit).toHaveBeenCalledWith({ queryParams: { pricemin: 10, pricemax: 100}});
    });
    it('should emit data correctely', () => {
      component.form.setValue({ min: 0, max: 100 });
      component.setPriceFilter();
      expect(component.selectedFacet.emit).toHaveBeenCalledWith({ queryParams: { pricemax: 100}});
    });
    it('should emit data correctely', () => {
      component.form.setValue({ min: '', max: 100 });
      component.setPriceFilter();
      expect(component.selectedFacet.emit).toHaveBeenCalledWith({ queryParams: { pricemax: 100}});
    });
    it('should emit data correctely', () => {
      component.form.setValue({ min: 10, max: 'dsfsdf' });
      component.setPriceFilter();
      expect(component.selectedFacet.emit).toHaveBeenCalledWith({ queryParams: { pricemin: 10 }});
    });
    it('should emit data correctely', () => {
      component.form.setValue({ min: -2, max: 300 });
      component.setPriceFilter();
      expect(component.selectedFacet.emit).toHaveBeenCalledWith({ queryParams: { pricemax: 300 }});
    });

  });

  describe('clear', () => {
    beforeEach(() => {
      spyOn(component.selectedFacet, 'emit');
      component.clear();
    });
    it('should reset the form', () => {
      expect(component.form.get('min').value).toEqual('');
      expect(component.form.get('max').value).toEqual('');
    });
    it('should emit empty object', () => {
      expect(component.selectedFacet.emit).toHaveBeenCalledWith({ queryParams: {}});
    });
  });
});
