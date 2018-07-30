import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileComponent } from '@app-buyer/profile/containers/profile/profile.component';
import { SharedModule, PhoneFormatPipe, AppStateService } from '@app-buyer/shared';
import { AddressListComponent } from '@app-buyer/profile/containers/address-list/address-list.component';
import { ProfileModule } from '@app-buyer/profile/profile.module';
import { NO_ERRORS_SCHEMA, InjectionToken } from '@angular/core';
import { MeService, TokenService, Configuration } from '@ordercloud/angular-sdk';
import { CookieModule } from 'ngx-cookie';
import { applicationConfiguration, AppConfig } from '@app-buyer/config/app.config';
import { ToastrService } from 'ngx-toastr';
import { RouterTestingModule } from '@angular/router/testing';

describe('ProfileComponent', () => {
  let component: ProfileComponent;
  let fixture: ComponentFixture<ProfileComponent>;
  const toastrService = { Success: jasmine.createSpy('Success') };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ProfileComponent
      ],
      imports: [
        CookieModule.forRoot(),
        RouterTestingModule,
        SharedModule
      ],
      providers: [
        AppStateService,
        MeService,
        TokenService,
        AddressListComponent,
        PhoneFormatPipe,
        { provide: ToastrService, useValue: toastrService },
        { provide: applicationConfiguration, useValue: new InjectionToken<AppConfig>('app.config') },
      ],
      schemas: [NO_ERRORS_SCHEMA] // Ignore template errors: remove if tests are added to test template
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileComponent);
    component = fixture.componentInstance;
    component.tabs = [
      { display: 'Details', route: ['/profile', 'details'] },
      { display: 'Addresses', route: ['/profile', 'addresses'] },
      { display: 'Payment Methods', route: ['/profile', 'payment-methods'] },
      { display: 'My Orders', route: ['/profile', 'orders'] },
      { display: 'Orders To Approve', route: ['/profile', 'orders', 'approval'] }
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
      expect(component.selectTab).toHaveBeenCalledWith({ display: 'Details', route: ['/profile', 'details'] });
      expect(component.selectedTab).toBe('Details');
    });
  });

  describe('selectTab', () => {
    it('should set selectedTab to tab.display', () => {
      component['tabs'].forEach(tab => {
        component.selectTab(tab);
        expect(component.selectedTab).toBe(tab.display);
      });
    });
  });
});
