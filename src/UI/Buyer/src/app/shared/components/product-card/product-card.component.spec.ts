import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ProductCardComponent } from '@app/shared/components/product-card/product-card.component';
import { QuantityInputComponent } from '@app/shared/components/quantity-input/quantity-input.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ToggleFavoriteComponent } from '@app/shared/components/toggle-favorite/toggle-favorite.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ToastrService } from '../../../../../node_modules/ngx-toastr';

describe('ProductCardComponent', () => {
  let component: ProductCardComponent;
  let fixture: ComponentFixture<ProductCardComponent>;
  const router = {
    navigate: jasmine.createSpy('navigate'),
    url: ''
  };
  const toastrService = {
    error: jasmine.createSpy('error')
  };


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
      ],
      providers: [
        { provide: Router, useValue: router },
        { provide: ToastrService, useValue: toastrService }
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

  describe('toProductDetails', () => {
    beforeEach(() => {
      component.toProductDetails({ ID: 'mockProductId' });
    });
    it('should route to product details component', () => {
      expect(router.navigate).toHaveBeenCalledWith(['/products/detail'], { queryParams: { ID: 'mockProductId' } });
    });
  });
});
