import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { PriceFilterComponent } from '@app-buyer/product/components/price-filter/price-filter.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbCollapseModule } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

describe('PriceFilterComponent', () => {
  let component: PriceFilterComponent;
  let fixture: ComponentFixture<PriceFilterComponent>;

  const activatedRoute = {
    snapshot: { queryParams: { minPrice: '100', maxPrice: '300' } },
    queryParams: new BehaviorSubject({ minPrice: '10', maxPrice: '12' }),
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PriceFilterComponent],
      imports: [NgbCollapseModule, FontAwesomeModule, ReactiveFormsModule],
      providers: [{ provide: ActivatedRoute, useValue: activatedRoute }],
    }).compileComponents();
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
      spyOn(component, 'setForm');
      component.ngOnInit();
    });
    it('should set the form', () => {
      expect(component.setForm).toHaveBeenCalled();
    });
  });

  describe('setForm', () => {
    it('should initialize values for min and max from query params', () => {
      activatedRoute.queryParams.next({ minPrice: '30', maxPrice: '50' });
      component.setForm();
      expect(component.form.value).toEqual({
        min: '30',
        max: '50',
      });
    });
  });

  describe('setPriceFilters', () => {
    beforeEach(() => {
      spyOn(component.priceFilterChange, 'emit');
    });
    it('should emit data correctely', () => {
      component.form.setValue({ min: 10, max: 100 });
      component.setPriceFilter();
      expect(component.priceFilterChange.emit).toHaveBeenCalledWith({
        minPrice: 10,
        maxPrice: 100,
      });
    });
    it('should emit data correctely', () => {
      component.form.setValue({ min: 0, max: 100 });
      component.setPriceFilter();
      expect(component.priceFilterChange.emit).toHaveBeenCalledWith({
        maxPrice: 100,
        minPrice: undefined,
      });
    });
    it('should emit data correctely', () => {
      component.form.setValue({ min: '', max: 100 });
      component.setPriceFilter();
      expect(component.priceFilterChange.emit).toHaveBeenCalledWith({
        maxPrice: 100,
        minPrice: undefined,
      });
    });
    it('should emit data correctely', () => {
      component.form.setValue({ min: 10, max: 'dsfsdf' });
      component.setPriceFilter();
      expect(component.priceFilterChange.emit).toHaveBeenCalledWith({
        minPrice: 10,
        maxPrice: undefined,
      });
    });
    it('should emit data correctely', () => {
      component.form.setValue({ min: -2, max: 300 });
      component.setPriceFilter();
      expect(component.priceFilterChange.emit).toHaveBeenCalledWith({
        maxPrice: 300,
        minPrice: undefined,
      });
    });
  });
});
