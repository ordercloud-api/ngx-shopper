import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Configuration } from '@ordercloud/angular-sdk';
import { applicationConfiguration, AppConfig } from '@app/config/app.config';
import { InjectionToken } from '@angular/core';
import { CookieModule } from 'ngx-cookie';
import { of } from 'rxjs';
import { HomeComponent } from '@app/layout/home/home.component';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;


  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [
        CookieModule.forRoot()
      ],
      providers: [
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
  });
});
