import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductCardComponent } from '@app/shared/components/product-card/product-card.component';
import { QuantityInputComponent } from '@app/shared/components/quantity-input/quantity-input.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ToggleFavoriteComponent } from '@app/shared/components/toggle-favorite/toggle-favorite.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

describe('ProductCardComponent', () => {
  let component: ProductCardComponent;
  let fixture: ComponentFixture<ProductCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ProductCardComponent,
        QuantityInputComponent,
        ToggleFavoriteComponent
      ],
      imports: [
        ReactiveFormsModule,
        FontAwesomeModule
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductCardComponent);
    component = fixture.componentInstance;
    component.product = {
      ID: '3HQ_lazyboy',
      Name: 'Lazyboy Recliner'
    };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('addToCart', () => {
    beforeEach(() => {
      spyOn(component.addedToCart, 'emit');
      component.addToCart({ product: component.product, quantity: 1 });
    });
    it('should emit event to parent', () => {
      expect(component.addedToCart.emit).toHaveBeenCalledWith({ product: component.product, quantity: 1 });
    });
  });
});
