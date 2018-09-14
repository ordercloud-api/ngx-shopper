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
import { ActivatedRoute, Router } from '@angular/router';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  const activatedRoute = {
    queryParams: new Subject(),
  };
  let router = {
    url: '/products',
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SearchComponent, FaIconComponent],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: Router, useValue: router },
      ],
      imports: [ReactiveFormsModule],
    }).compileComponents();
    router = TestBed.get(Router);
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
      spyOn(component as any, 'search');
    });

    it('should not call search if previous search term is the same', () => {
      component.previousSearchTerm = 'mockSearchTerm';
      component['onFormChanges']();
      component.form.controls.search.setValue('mockSearchTerm');
      expect(component['search']).not.toHaveBeenCalled();
    });
    it('should not call search if not on product list page', () => {
      router.url = '/products/volleyball';
      component.previousSearchTerm = 'blah';
      component['onFormChanges']();
      component.form.controls.search.setValue('');
      expect(component['search']).not.toHaveBeenCalled();
    });
    it(
      'should emit search after 500ms of form change',
      fakeAsync(() => {
        router.url = '/products';
        component['onFormChanges']();
        component.form.controls['search'].setValue('mockSearchTerm');
        tick(499);
        expect(component['search']).not.toHaveBeenCalled();
        tick(1);
        expect(component['search']).toHaveBeenCalled();
      })
    );
  });

  describe('search', () => {
    beforeEach(() => {
      spyOn(component.searched, 'emit');
    });
    it('should emit value from form', () => {
      component.form.controls.search.setValue('some value');
      component['search']();
      expect(component.searched.emit).toHaveBeenCalledWith('some value');
    });
    it('should emit undefined for empty strings', () => {
      component.form.controls.search.setValue('');
      component['search']();
      expect(component.searched.emit).toHaveBeenCalledWith(undefined);
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
