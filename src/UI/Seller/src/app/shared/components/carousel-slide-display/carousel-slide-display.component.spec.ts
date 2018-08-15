import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CarouselSlideDisplayComponent } from '@app-seller/shared/components/carousel-slide-display/carousel-slide-display.component';

describe('CarouselSlideDisplayComponent', () => {
  let component: CarouselSlideDisplayComponent;
  let fixture: ComponentFixture<CarouselSlideDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CarouselSlideDisplayComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CarouselSlideDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
