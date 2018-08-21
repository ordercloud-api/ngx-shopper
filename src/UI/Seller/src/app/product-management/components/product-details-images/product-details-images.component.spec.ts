import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDetailsImagesComponent } from '@app-seller/product-management/components/product-details-images/product-details-images.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ToastrService } from 'ngx-toastr';

describe('ProductDetailsImagesComponent', () => {
  let component: ProductDetailsImagesComponent;
  let fixture: ComponentFixture<ProductDetailsImagesComponent>;
  const toastrService = { warning: jasmine.createSpy('warning') };
  const mockProduct = { xp: { imageURLs: ['A', 'B', 'C', 'D'] } };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProductDetailsImagesComponent],
      imports: [FontAwesomeModule],
      providers: [{ provide: ToastrService, useValue: toastrService }],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductDetailsImagesComponent);
    component = fixture.componentInstance;
    component.product = mockProduct;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('deleteImage', () => {
    beforeEach(() => {
      spyOn(component.update, 'emit');
      component.product.xp.imageURLs = ['A', 'B', 'C', 'D'];
    });
    it('should remove image url from the array and emit event 1', () => {
      component.deleteImage(0);
      expect(component.product.xp.imageURLs).toEqual(['B', 'C', 'D']);
      expect(component.update.emit).toHaveBeenCalledWith(component.product);
    });
    it('should remove image url from the array and emit event 1', () => {
      component.deleteImage(1);
      expect(component.product.xp.imageURLs).toEqual(['A', 'C', 'D']);
      expect(component.update.emit).toHaveBeenCalledWith(component.product);
    });
    it('should remove image url from the array and emit event 1', () => {
      component.deleteImage(2);
      expect(component.product.xp.imageURLs).toEqual(['A', 'B', 'D']);
      expect(component.update.emit).toHaveBeenCalledWith(component.product);
    });
  });

  describe('setPrimaryImage', () => {
    beforeEach(() => {
      spyOn(component.update, 'emit');
      component.product.xp.imageURLs = ['A', 'B', 'C', 'D'];
    });
    it('should remove image url from the array and emit event 1', () => {
      component.setPrimaryImage('A', 0);
      expect(component.product.xp.imageURLs).toEqual(['A', 'B', 'C', 'D']);
      expect(component.update.emit).toHaveBeenCalledWith(component.product);
    });
    it('should remove image url from the array and emit event 1', () => {
      component.setPrimaryImage('B', 1);
      expect(component.product.xp.imageURLs).toEqual(['B', 'A', 'C', 'D']);
      expect(component.update.emit).toHaveBeenCalledWith(component.product);
    });
    it('should remove image url from the array and emit event 1', () => {
      component.setPrimaryImage('C', 2);
      expect(component.product.xp.imageURLs).toEqual(['C', 'A', 'B', 'D']);
      expect(component.update.emit).toHaveBeenCalledWith(component.product);
    });
  });
});
