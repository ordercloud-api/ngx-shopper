import { of } from 'rxjs';
import { AppStateService } from '@app-buyer/shared/services/app-state/app-state.service';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductCardComponent } from '@app-buyer/shared/components/product-card/product-card.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('ProductCardComponent', () => {
  let component: ProductCardComponent;
  let fixture: ComponentFixture<ProductCardComponent>;
  const router = {
    navigate: jasmine.createSpy('navigate'),
    url: '',
  };
  const toastrService = {
    error: jasmine.createSpy('error'),
  };
  const appStateService = {
    lineItemSubject: of({ Items: [] }),
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProductCardComponent],
      imports: [ReactiveFormsModule, FontAwesomeModule],
      providers: [
        { provide: Router, useValue: router },
        { provide: ToastrService, useValue: toastrService },
        { provide: AppStateService, useValue: appStateService },
      ],
      schemas: [NO_ERRORS_SCHEMA], // Ignore template errors: remove if tests are added to test template
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductCardComponent);
    component = fixture.componentInstance;
    component.product = {
      ID: '3HQ_lazyboy',
      Name: 'Lazyboy Recliner',
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
      expect(component.addedToCart.emit).toHaveBeenCalledWith({
        product: component.product,
        quantity: 1,
      });
    });
  });
});
