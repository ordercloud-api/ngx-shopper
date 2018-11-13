import {
  async,
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { HeaderComponent } from '@app-buyer/layout/header/header.component';
import { AppStateService, BaseResolveService } from '@app-buyer/shared';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgbPopoverModule, NgbPopoverConfig } from '@ng-bootstrap/ng-bootstrap';
import { CookieModule } from 'ngx-cookie';
import {
  applicationConfiguration,
  AppConfig,
} from '@app-buyer/config/app.config';
import { InjectionToken, NO_ERRORS_SCHEMA } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { AppAuthService } from '@app-buyer/auth';
import { SearchComponent } from '@app-buyer/shared/components/search/search.component';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;

  const mockOrder = { ID: 'orderID' };

  const baseResolveService = { resetUser: jasmine.createSpy('resetUser') };

  const appStateService = {
    userSubject: new BehaviorSubject({}),
    orderSubject: new BehaviorSubject({}),
    isAnonSubject: new BehaviorSubject({}),
    addToCartSubject: new Subject(),
  };
  const router = { navigate: jasmine.createSpy('navigate'), url: '' };
  const appAuthService = { logout: jasmine.createSpy('logout') };
  const activatedRoute = { queryParams: new BehaviorSubject({}) };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderComponent, SearchComponent],
      imports: [
        CookieModule.forRoot(),
        FontAwesomeModule,
        NgbPopoverModule,
        ReactiveFormsModule,
        HttpClientModule,
      ],
      schemas: [NO_ERRORS_SCHEMA], // Ignore template errors: remove if tests are added to test template
      providers: [
        { provide: AppStateService, useValue: appStateService },
        { provide: AppAuthService, useValue: appAuthService },
        { provide: Router, useValue: router },
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: BaseResolveService, useValue: baseResolveService },
        NgbPopoverConfig,
        {
          provide: applicationConfiguration,
          useValue: new InjectionToken<AppConfig>('app.config'),
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    component.alive = true;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      appStateService.orderSubject.next(mockOrder);
      spyOn(component, 'buildAddToCartListener');
      component.ngOnInit();
    });
    it('should define currentOrder', () => {
      expect(component.currentOrder).toEqual(mockOrder);
    });
    it('should call buildAddToCartListener', () => {
      expect(component.buildAddToCartListener).toHaveBeenCalled();
    });
  });

  describe('buildAddToCartListener', () => {
    beforeEach(() => {
      spyOn(component.popover, 'open');
      spyOn(component.popover, 'close');
    });
    it('should set correct popover message', () => {
      appStateService.addToCartSubject.next({ quantity: 4 });
      expect(component.popover.ngbPopover).toBe('4 Item(s) Added to Cart');
    });
  });
});
