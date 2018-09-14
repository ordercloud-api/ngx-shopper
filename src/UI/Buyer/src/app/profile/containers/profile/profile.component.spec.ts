import { BaseResolveService } from '@app-buyer/shared/services/base-resolve/base-resolve.service';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileComponent } from '@app-buyer/profile/containers/profile/profile.component';
import {
  SharedModule,
  PhoneFormatPipe,
  AppStateService,
} from '@app-buyer/shared';
import { AddressListComponent } from '@app-buyer/profile/containers/address-list/address-list.component';
import { ProfileModule } from '@app-buyer/profile/profile.module';
import { NO_ERRORS_SCHEMA, InjectionToken } from '@angular/core';
import {
  OcMeService,
  OcTokenService,
  Configuration,
} from '@ordercloud/angular-sdk';
import { CookieModule } from 'ngx-cookie';
import {
  applicationConfiguration,
  AppConfig,
} from '@app-buyer/config/app.config';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  let appStateService: AppStateService;
  const toastrService = { Success: jasmine.createSpy('Success') };
  const ocTokenService = { RemoveAccess: jasmine.createSpy('RemoveAccess') };
  const baseResolveService = { resetUser: jasmine.createSpy('resetUser') };
  const router = { navigate: jasmine.createSpy('navigate'), url: '' };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProfileComponent],
      imports: [CookieModule.forRoot(), SharedModule],
      providers: [
        AppStateService,
        OcMeService,
        AddressListComponent,
        PhoneFormatPipe,
        { provide: ToastrService, useValue: toastrService },
        { provide: OcTokenService, useValue: ocTokenService },
        { provide: BaseResolveService, useValue: baseResolveService },
        { provide: Router, useValue: router },
        {
          provide: applicationConfiguration,
          useValue: new InjectionToken<AppConfig>('app.config'),
        },
      ],
      schemas: [NO_ERRORS_SCHEMA], // Ignore template errors: remove if tests are added to test template
    }).compileComponents();
    appStateService = TestBed.get(AppStateService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    component.tabs = [
      { display: 'Details', route: ['/profile', 'details'] },
      { display: 'Addresses', route: ['/profile', 'addresses'] },
      { display: 'Payment Methods', route: ['/profile', 'payment-methods'] },
      { display: 'My Orders', route: ['/profile', 'orders'] },
      {
        display: 'Orders To Approve',
        route: ['/profile', 'orders', 'approval'],
      },
    ];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      spyOn(component, 'selectTab');
      component.ngOnInit();
    });
    it('should set tab to first item in tabs array', () => {
      expect(component.selectTab).toHaveBeenCalledWith({
        display: 'Details',
        route: ['/profile', 'details'],
      });
      expect(component.selectedTab).toBe('Details');
    });
  });

  describe('selectTab', () => {
    it('should set selectedTab to tab.display', () => {
      component['tabs'].forEach((tab) => {
        component.selectTab(tab);
        expect(component.selectedTab).toBe(tab.display);
      });
    });
  });

  describe('logout', () => {
    beforeEach(() => {
      router.navigate.calls.reset();
    });
    it('should remove token', () => {
      component.logout();
      expect(ocTokenService.RemoveAccess).toHaveBeenCalled();
    });
    it('should refresh current user if user is anonymous', () => {
      appStateService.isAnonSubject.next(true);
      component.logout();
      expect(baseResolveService.resetUser).toHaveBeenCalled();
    });
    it('should route to login if user is profiled', () => {
      appStateService.isAnonSubject.next(false);
      component.logout();
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });
  });
});
