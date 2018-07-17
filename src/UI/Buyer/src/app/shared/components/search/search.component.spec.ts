import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';

import { SearchComponent } from '@app/shared/components/search/search.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        SearchComponent,
        FaIconComponent
      ],
      imports: [
        ReactiveFormsModule,
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchComponent);
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
    it('should initialize search to empty string', () => {
      expect(component.form.value).toEqual({
        search: '',
      });
    });
    it('should call onFormChanges', () => {
      expect(component['onFormChanges']).toHaveBeenCalled();
    });
  });

  describe('onFormChanges', () => {
    beforeEach(() => {
      spyOn(component as any, 'search');
    });
    it('should call search after 500ms of form change', fakeAsync(() => {
      component['onFormChanges']();
      component.form.controls['search'].setValue('mockSearchTerm');
      tick(499);
      expect(component['search']).not.toHaveBeenCalled();
      tick(1);
      expect(component['search']).toHaveBeenCalled();
    }));
  });

  describe('search', () => {
    beforeEach(() => {
      spyOn(component.searched, 'emit');
    });
    it('should emit search term from form', () => {
      component.form.controls['search'].setValue('mockSearchTerm');
      component['search']();
      expect(component.searched.emit).toHaveBeenCalledWith('mockSearchTerm');
    });
    it('empty string form value should emit as undefined', () => {
      component.form.controls['search'].setValue('');
      component['search']();
      expect(component.searched.emit).toHaveBeenCalledWith(undefined);
    });
    it('null form value should emit as undefined', () => {
      component.form.controls['search'].setValue(null);
      component['search']();
      expect(component.searched.emit).toHaveBeenCalledWith(undefined);
    });
  });

  describe('ngOnDestroy', () => {
    it('should set alive to false', () => {
      expect(component.alive).toBe(true);
      component.ngOnDestroy();
      expect(component.alive).toBe(false);
    });
  });
});
