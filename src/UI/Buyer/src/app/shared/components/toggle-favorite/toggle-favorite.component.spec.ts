import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToggleFavoriteComponent } from '@app-buyer/shared/components/toggle-favorite/toggle-favorite.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

describe('FavoriteButtonComponent', () => {
  let component: ToggleFavoriteComponent;
  let fixture: ComponentFixture<ToggleFavoriteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ToggleFavoriteComponent],
      imports: [FontAwesomeModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToggleFavoriteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show red icon when favorite is true', () => {
    component.favorite = true;
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('.favorite');
    const el2 = fixture.nativeElement.querySelector('.not-favorite');
    expect(el).toBeTruthy();
    expect(el2).toBeFalsy();
  });

  it('should show clear icon when favorite is false', () => {
    component.favorite = false;
    fixture.detectChanges();
    const el = fixture.nativeElement.querySelector('.favorite');
    const el2 = fixture.nativeElement.querySelector('.not-favorite');
    expect(el).toBeFalsy();
    expect(el2).toBeTruthy();
  });

  it('should emit true when empty icon is clicked', () => {
    spyOn(component.favoriteChanged, 'emit');
    component.favorite = false;
    fixture.detectChanges();
    const el = fixture.debugElement.nativeElement.querySelector(
      '.not-favorite'
    );
    el.click();
    expect(component.favoriteChanged.emit).toHaveBeenCalledWith(true);
  });

  it('should emit false when red icon is clicked', () => {
    spyOn(component.favoriteChanged, 'emit');
    component.favorite = true;
    fixture.detectChanges();
    const el = fixture.debugElement.nativeElement.querySelector('.favorite');
    el.click();
    expect(component.favoriteChanged.emit).toHaveBeenCalledWith(false);
  });
});
