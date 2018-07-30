import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import {
  Configuration,
  OcMeService,
  OcBuyerService,
} from '@ordercloud/angular-sdk';
import {
  applicationConfiguration,
  AppConfig,
} from '@app-buyer/config/app.config';
import { InjectionToken } from '@angular/core';
import { CookieModule } from 'ngx-cookie';
import { of } from 'rxjs';
import { HomeComponent } from '@app-buyer/layout/home/home.component';
import { NgbCarouselConfig, NgbCarousel } from '@ng-bootstrap/ng-bootstrap';
import { ProductCarouselComponent } from '@app-buyer/shared/components/product-carousel/product-carousel.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ProductCardComponent } from '@app-buyer/shared/components/product-card/product-card.component';
import { ToggleFavoriteComponent } from '@app-buyer/shared/components/toggle-favorite/toggle-favorite.component';
import { QuantityInputComponent } from '@app-buyer/shared/components/quantity-input/quantity-input.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  const mockProducts = { Items: [] };
  const mockBuyer = { Items: [{ xp: {} }] };
  const meService = {
    ListProducts: jasmine
      .createSpy('ListProducts')
      .and.returnValue(of(mockProducts)),
  };
  const buyerService = {
    List: jasmine.createSpy('List').and.returnValue(of(mockBuyer)),
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        HomeComponent,
        NgbCarousel,
        ProductCarouselComponent,
        ProductCardComponent,
        ToggleFavoriteComponent,
        QuantityInputComponent,
      ],
      imports: [
        CookieModule.forRoot(),
        FontAwesomeModule,
        ReactiveFormsModule,
        RouterTestingModule,
      ],
      providers: [
        NgbCarouselConfig,
        { provide: OcMeService, useValue: meService },
        { provide: OcBuyerService, useValue: buyerService },
        {
          provide: applicationConfiguration,
          useValue: new InjectionToken<AppConfig>('app.config'),
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      component.ngOnInit();
    });
    it('should call listProducts', () => {
      expect(meService.ListProducts).toHaveBeenCalled();
      expect(buyerService.List).toHaveBeenCalled();
    });
  });
});
