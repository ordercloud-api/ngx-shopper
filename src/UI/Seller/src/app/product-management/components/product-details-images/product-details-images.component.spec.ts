import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDetailsImagesComponent } from './product-details-images.component';

describe('ProductDetailsImagesComponent', () => {
  let component: ProductDetailsImagesComponent;
  let fixture: ComponentFixture<ProductDetailsImagesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ProductDetailsImagesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductDetailsImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
