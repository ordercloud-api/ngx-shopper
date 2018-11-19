import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MeUpdateComponent } from '@app-buyer/profile/containers/me-update/me-update.component';
import { ReactiveFormsModule } from '@angular/forms';
import {
  OcMeService,
  OcTokenService,
  OcAuthService,
} from '@ordercloud/angular-sdk';
import { CookieModule } from 'ngx-cookie';
import {
  applicationConfiguration,
  AppConfig,
} from '@app-buyer/config/app.config';
import { InjectionToken, NO_ERRORS_SCHEMA } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AppStateService, AppFormErrorService } from '@app-buyer/shared';
import { of, Subject } from 'rxjs';
import { ModalService } from '@app-buyer/shared/services/modal/modal.service';

describe('MeUpdateComponent', () => {
  let component: MeUpdateComponent;
  let fixture: ComponentFixture<MeUpdateComponent>;

  const appStateService = { userSubject: new Subject<any>() };
  const me = {
    Username: 'crhistianr',
    FirstName: 'Crhistian',
    LastName: 'Ramirez',
    Email: 'crhistian@gmail.com',
    Phone: '555-555-5555',
  };
  const ocMeService = {
    Get: jasmine.createSpy('Get').and.returnValue(of(me)),
    Patch: jasmine.createSpy('Patch').and.returnValue(of(me)),
    Register: jasmine.createSpy('Register').and.returnValue(of(null)),
    ResetPasswordByToken: jasmine
      .createSpy('ResetPasswordByToken')
      .and.returnValue(of(null)),
  };
  const toastrService = { success: jasmine.createSpy('success') };
  const tokenService = {
    GetAccess: jasmine.createSpy('GetAccess').and.returnValue('mockToken'),
  };
  const router = { navigate: jasmine.createSpy('navigate') };
  const formErrorService = {
    hasRequiredError: jasmine.createSpy('hasRequiredError'),
    hasInvalidEmailError: jasmine.createSpy('hasInvalidEmailError'),
    hasPasswordMismatchError: jasmine.createSpy('hasPasswordMismatchError'),
    hasStrongPasswordError: jasmine.createSpy('hasStrongPasswordError'),
    displayFormErrors: jasmine.createSpy('displayFormErrors'),
    hasPatternError: jasmine.createSpy('hasPatternError'),
  };
  const modalService = {
    open: jasmine.createSpy('open'),
    close: jasmine.createSpy('close'),
    add: jasmine.createSpy('add'),
    remove: jasmine.createSpy('remove'),
    onCloseSubject: new Subject<string>(),
  };
  let ocAuthService = {
    Login: () => {},
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MeUpdateComponent],
      imports: [ReactiveFormsModule, CookieModule.forRoot()],
      providers: [
        { provide: AppFormErrorService, useValue: formErrorService },
        { provide: Router, useValue: router },
        { provide: OcTokenService, useValue: tokenService },
        { provide: OcMeService, useValue: ocMeService },
        { provide: AppStateService, useValue: appStateService },
        { provide: ToastrService, useValue: toastrService },
        { provide: ModalService, useValue: modalService },
        { provide: OcAuthService, useValue: ocAuthService },
        {
          provide: applicationConfiguration,
          useValue: new InjectionToken<AppConfig>('app.config'),
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
    ocAuthService = TestBed.get(OcAuthService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MeUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      spyOn(component as any, 'setForm');
      spyOn(component as any, 'getMeData');
    });
    it('should call setForm', () => {
      component.ngOnInit();
      expect(component['setForm']).toHaveBeenCalled();
    });
    it('should call getMeData', () => {
      component.ngOnInit();
      expect(component['getMeData']).toHaveBeenCalled();
    });
  });

  describe('setForm', () => {
    it('should initialize form', () => {
      component['setForm']();
      expect(component.form.value).toEqual({
        Username: '',
        FirstName: '',
        LastName: '',
        Email: '',
        Phone: '',
      });
    });
  });

  describe('onChangePassword', () => {
    beforeEach(() => {
      component.me = { Username: 'crhistian' };
    });
    afterEach(() => {
      ocMeService.ResetPasswordByToken.calls.reset();
    });
    it('should verify user knows current password for security purposes', () => {
      spyOn(ocAuthService, 'Login').and.returnValue(of(null));
      component.onChangePassword({
        currentPassword: 'password123',
        newPassword: 'new-pw',
      });
      expect(ocAuthService.Login).toHaveBeenCalledWith(
        component.me.Username,
        'password123',
        component['appConfig'].clientID,
        component['appConfig'].scope
      );
    });
    it('should reset password if verification of current password succeeds', () => {
      spyOn(ocAuthService, 'Login').and.returnValue(of(null));
      component.onChangePassword({
        currentPassword: 'incorrect-pw',
        newPassword: 'new-pw',
      });
      expect(ocMeService.ResetPasswordByToken).toHaveBeenCalledWith({
        NewPassword: 'new-pw',
      });
    });
    it('should close modal on successful change', () => {
      component.changePasswordModalId = 'mockModalId';
      spyOn(ocAuthService, 'Login').and.returnValue(of(null));
      component.onChangePassword({
        currentPassword: 'incorrect-pw',
        newPassword: 'new-pw',
      });
      expect(component['modalService'].close).toHaveBeenCalledWith(
        'mockModalId'
      );
    });
  });

  describe('onSubmit', () => {
    beforeEach(() => {});
    it('should call displayFormErrors if form is invalid', () => {
      component.form.controls.FirstName.setValue('');
      component['onSubmit']();
      expect(formErrorService.displayFormErrors).toHaveBeenCalled();
    });
    it('should call meService.Patch', () => {
      component.form.controls.Username.setValue('crhistianr');
      component.form.controls.FirstName.setValue('Crhistian');
      component.form.controls.LastName.setValue('Ramirez');
      component.form.controls.Phone.setValue('5555555555');
      component.form.controls.Email.setValue(
        'crhistian-rawks@my-little-pony.com'
      );
      component['onSubmit']();
      expect(ocMeService.Patch).toHaveBeenCalledWith({
        Username: 'crhistianr',
        FirstName: 'Crhistian',
        LastName: 'Ramirez',
        Phone: '5555555555',
        Email: 'crhistian-rawks@my-little-pony.com',
        Active: true,
      });
    });
  });

  describe('getMeData', () => {
    beforeEach(() => {
      spyOn(component.form, 'setValue');
      component['getMeData']();
    });
    it('should call meService.Get', () => {
      expect(ocMeService.Get).toHaveBeenCalled();
    });
    it('should set form with me data', () => {
      expect(component.form.setValue).toHaveBeenCalledWith({
        Username: me.Username,
        FirstName: me.FirstName,
        LastName: me.LastName,
        Phone: me.Phone,
        Email: me.Email,
      });
    });
  });
});
