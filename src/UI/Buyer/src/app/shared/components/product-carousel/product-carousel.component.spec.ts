import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { ProductCarouselComponent } from '@app-buyer/shared/components/product-carousel/product-carousel.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, NavigationEnd } from '@angular/router';
import { Subject } from 'rxjs';
import { BuyerProduct } from '@ordercloud/angular-sdk';

describe('ProductCarouselComponent', () => {
  let component: ProductCarouselComponent;
  let fixture: ComponentFixture<ProductCarouselComponent>;

  const router = {
    navigate: jasmine.createSpy('navigate'),
    events: new Subject<NavigationEnd>(),
    navigated: true,
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProductCarouselComponent],
      providers: [RouterTestingModule, { provide: Router, useValue: router }],
      schemas: [NO_ERRORS_SCHEMA], // Ignore template errors: remove if tests are added to test template
    }).compileComponents();
  }));

  beforeEach(() => {
    const mockProducts = <BuyerProduct[]>[
      { ID: '1' },
      { ID: '2' },
      { ID: '3' },
      { ID: '4' },
      { ID: '5' },
      { ID: '6' },
      { ID: '7' },
    ];

    fixture = TestBed.createComponent(ProductCarouselComponent);
    component = fixture.componentInstance;
    component.products = mockProducts;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('left', () => {
    it('should move the right number left', () => {
      const oldIndex = component.index;
      component.left();
      expect(component.index).toEqual(oldIndex - component.rowLength);
    });
  });

  describe('right', () => {
    it('should move the right number right', () => {
      const oldIndex = component.index;
      component.right();
      expect(component.index).toEqual(oldIndex + component.rowLength);
    });
  });

  describe('getProducts', () => {
    it('should return the right number of products', () => {
      expect(component.getProducts().length).toEqual(component.rowLength);
    });

    it('should return products starting at index', () => {
      expect(component.products.indexOf(component.getProducts()[0])).toEqual(
        component.index
      );
    });
  });
});
