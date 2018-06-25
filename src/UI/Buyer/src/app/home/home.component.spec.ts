import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from './home.component';
import { Configuration } from '@ordercloud/angular-sdk';
import { applicationConfiguration, AppConfig } from '@app/config/app.config';
import { InjectionToken } from '@angular/core';
import { GeolocatorService } from '@app/shared';
import { CookieModule } from 'ngx-cookie';
import { of } from 'rxjs';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  const geoLocatorService = { saveClientLocation: jasmine.createSpy('saveClientLocation').and.returnValue(of({})) };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [
        CookieModule.forRoot()
      ],
      providers: [
        { provide: GeolocatorService, useValue: geoLocatorService },
        { provide: Configuration, useValue: new Configuration() },
        { provide: applicationConfiguration, useValue: new InjectionToken<AppConfig>('app.config') }
      ]
    })
      .compileComponents();
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
    it('should set users location in cookies', () => {
      expect(geoLocatorService.saveClientLocation).toHaveBeenCalled();
    });
  });
});
