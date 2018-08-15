import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarouselSlideDisplayComponent } from '@app-seller/shared/components/carousel-slide-display/carousel-slide-display.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ReactiveFormsModule, FormsModule, FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

describe('CarouselSlideDisplayComponent', () => {
  let component: CarouselSlideDisplayComponent;
  let fixture: ComponentFixture<CarouselSlideDisplayComponent>;
  const toastrService = { warning: jasmine.createSpy('warning') };
  const mockSlide = {
    URL: 'http://example.com',
    headerText: 'text',
    bodyText: 'body',
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FontAwesomeModule, ReactiveFormsModule, FormsModule],
      providers: [
        FormBuilder,
        { provide: ToastrService, useValue: toastrService },
      ],
      declarations: [CarouselSlideDisplayComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarouselSlideDisplayComponent);
    component = fixture.componentInstance;
    component.slide = mockSlide;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should setup form', () => {
      expect(component.carouselForm.value).toEqual(mockSlide);
    });
  });

  describe('formUnchanged', () => {
    it('should be true before form changes', () => {
      component.slide = mockSlide;
      expect(component.formUnchanged()).toEqual(true);
    });
    it('should be false after form changes', () => {
      component.slide = {
        URL: 'http://example.com',
        headerText: 'new text',
        bodyText: 'body',
      };
      fixture.detectChanges();
      expect(component.formUnchanged()).toEqual(false);
    });
  });

  describe('textChanges', () => {
    beforeEach(() => {
      component.slide = mockSlide;
      spyOn(component.save, 'emit');
      component.textChanges();
    });
    it('if text hasnt changed do nothing', () => {
      expect(component.save.emit).not.toHaveBeenCalled();
    });
    it('if text has changed emit', () => {
      component.slide = {
        URL: 'http://example.com',
        headerText: 'new text',
        bodyText: 'body',
      };
      fixture.detectChanges();
      component.textChanges();
      expect(component.save.emit).toHaveBeenCalledWith({
        new: mockSlide,
        prev: {
          URL: 'http://example.com',
          headerText: 'new text',
          bodyText: 'body',
        },
      });
    });
  });

  describe('deleteSlide', () => {
    it('should emit delete event', () => {
      spyOn(component.delete, 'emit');
      component.deleteSlide();
      expect(component.delete.emit).toHaveBeenCalledWith({
        prev: component.slide,
      });
    });
  });
});
