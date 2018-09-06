import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionalImageGalleryComponent } from '@app-buyer/product/components/additional-image-gallery/additional-image-gallery.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AdditionalImageGalleryComponent', () => {
  let component: AdditionalImageGalleryComponent;
  let fixture: ComponentFixture<AdditionalImageGalleryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AdditionalImageGalleryComponent],
      schemas: [NO_ERRORS_SCHEMA], // Ignore template errors: remove if tests are added to test template
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdditionalImageGalleryComponent);
    component = fixture.componentInstance;
    component.imgUrls = [
      'firstImage',
      'secondImage',
      'thirdImage',
      'fourthImage',
    ];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('select', () => {
    it('should selected index to the index of the image in array', () => {
      component.select('firstImage');
      expect(component.selectedIndex).toBe(0);

      component.select('secondImage');
      expect(component.selectedIndex).toBe(1);
    });
  });

  describe('isSelected', () => {
    it('should return false if index of image is not same as selectedIndex', () => {
      component.selectedIndex = 0;
      const isSelected = component.isSelected('firstImage');
      expect(isSelected).toBe(true);
    });
    it('should return true if index of image is same as selectedIndex', () => {
      component.selectedIndex = 1;
      const isSelected = component.isSelected('firstImage');
      expect(isSelected).toBe(false);
    });
  });

  describe('getGallery', () => {
    it('should correctly return an array of urls including and in between two indices', () => {
      component.startIndex = 2;
      component.endIndex = 3;

      const imageGallery = component.getGallery();
      const expected = ['thirdImage', 'fourthImage'];
      expect(imageGallery).toEqual(expected);
    });
  });

  describe('forward', () => {
    it('should increase selected index by one', () => {
      component.selectedIndex = 2;
      component.forward();
      expect(component.selectedIndex).toBe(3);
    });
    describe('if selected index is less than endIndex', () => {
      beforeEach(() => {
        component.selectedIndex = 1;
        component.endIndex = 2;
      });
      it('should not change startIndex', () => {
        component.startIndex = 2;
        component.forward();
        expect(component.startIndex).toBe(2);
      });
      it('should not change endIndex', () => {
        component.endIndex = 2;
        component.forward();
        expect(component.endIndex).toBe(2);
      });
    });
    describe('if selected index is greater than endIndex', () => {
      beforeEach(() => {
        component.selectedIndex = 2;
        component.endIndex = 1;
      });
      it('should increase startIndex by one', () => {
        component.startIndex = 2;
        component.forward();
        expect(component.startIndex).toBe(3);
      });
      it('should increase endIndex by one', () => {
        component.forward();
        expect(component.endIndex).toBe(2);
      });
      describe('and selectedIndex after forward is equal to length of images', () => {
        beforeEach(() => {
          component.selectedIndex = 3;
          component.endIndex = 2;
          component.startIndex = 0;
          component.forward();
        });
        it('should reset gallery to beginning if user forwards to last image', () => {
          expect(component.selectedIndex).toBe(0);
          expect(component.startIndex).toBe(0);
          expect(component.endIndex).toBe(component['gallerySize'] - 1);
        });
      });
    });
  });

  describe('backward', () => {
    it('should decrease selected index by one', () => {
      component.selectedIndex = 2;
      component.backward();
      expect(component.selectedIndex).toBe(1);
    });
    describe('if selected index is greater than startIndex', () => {
      beforeEach(() => {
        component.selectedIndex = 3;
        component.startIndex = 2;
      });
      it('should not change startIndex', () => {
        component.startIndex = 2;
        component.backward();
        expect(component.startIndex).toBe(2);
      });
      it('should not change endIndex', () => {
        component.endIndex = 2;
        component.backward();
        expect(component.endIndex).toBe(2);
      });
    });
    describe('if selected index is less than startIndex', () => {
      beforeEach(() => {
        component.selectedIndex = 2;
        component.startIndex = 3;
        component.endIndex = 1;
      });
      it('should decrease startIndex by one', () => {
        component.backward();
        expect(component.startIndex).toBe(2);
      });
      it('should decrease endIndex by one', () => {
        component.backward();
        expect(component.endIndex).toBe(0);
      });
      describe('and selectedIndex after forward is equal to length of images', () => {
        beforeEach(() => {
          component.selectedIndex = 0;
          component.startIndex = 1;
          component.endIndex = 2;
          component.backward();
        });
        it('should reset gallery to end if user backwards to first image', () => {
          expect(component.selectedIndex).toBe(3);
          expect(component.startIndex).toBe(0);
          expect(component.endIndex).toBe(3);
        });
      });
    });
  });
});
