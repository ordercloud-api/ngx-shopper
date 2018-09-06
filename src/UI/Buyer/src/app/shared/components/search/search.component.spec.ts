import {
  async,
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';

import { SearchComponent } from '@app-buyer/shared/components/search/search.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { Subject } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  const activatedRoute = {
    queryParams: new Subject(),
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SearchComponent, FaIconComponent],
      providers: [{ provide: ActivatedRoute, useValue: activatedRoute }],
      imports: [ReactiveFormsModule],
    }).compileComponents();
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
      spyOn(component as any, 'onQueryParamChanges');
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
    it('should call onFormChanges', () => {
      expect(component['onQueryParamChanges']).toHaveBeenCalled();
    });
  });

  describe('onFormChanges', () => {
    beforeEach(() => {
      spyOn(component.searched, 'emit');
    });
    it(
      'should emit search after 500ms of form change',
      fakeAsync(() => {
        component['onFormChanges']();
        component.form.controls['search'].setValue('mockSearchTerm');
        tick(499);
        expect(component.searched.emit).not.toHaveBeenCalled();
        tick(1);
        expect(component.searched.emit).toHaveBeenCalledWith('mockSearchTerm');
      })
    );
    it('should not emit value if previous search term is the same', () => {
      component.previousSearchTerm = 'mockSearchTerm';
      component['onFormChanges']();
      component.form.controls.search.setValue('mockSearchTerm');
      expect(component.searched.emit).not.toHaveBeenCalled();
    });
    it('should emit undefined if value is an empty string', () => {
      component.previousSearchTerm = 'mockSearchTerm';
      component['onFormChanges']();
      component.form.controls.search.setValue('');
      expect(component.searched.emit).not.toHaveBeenCalledWith(undefined);
    });
  });

  describe('onQueryParamChanges', () => {
    beforeEach(() => {
      component.form.controls.search.setValue('balloons');
    });
    it('should clear value if search is no longer a query param', () => {
      activatedRoute.queryParams.next({ anotherParamThatIsNotSearch: 'blah' });
      component['onQueryParamChanges']();
      expect(component.form.controls.search.value).toBe('');
    });
    it('should clear value if search is no longer a query param', () => {
      activatedRoute.queryParams.next({ search: 'blah' });
      component['onQueryParamChanges']();
      expect(component.form.controls.search.value).toBe('balloons');
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
