import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from '@app-buyer/shared/containers/register/register.component';
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
import { InjectionToken } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import {
  PhoneFormatPipe,
  AppStateService,
  AppFormErrorService,
} from '@app-buyer/shared';
import { of, Subject, BehaviorSubject, throwError } from 'rxjs';
import { ChangePasswordFormComponent } from '@app-buyer/shared/components/change-password-form/change-password-form.component';
import { ModalComponent } from '@app-buyer/shared/components/modal/modal.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { ModalService } from '@app-buyer/shared/services/modal/modal.service';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;

  const appStateService = { userSubject: new Subject<any>() };
  const me = {
    FirstName: 'Crhistian',
    LastName: 'Ramirez',
    Email: 'crhistian@gmail.com',
    Phone: '(555) 555-5555',
    xp: {
      age: '27',
      zip: '55418',
      getNewsletter: false,
      interestedIn: {
        guitars: true,
        percussion: false,
        band: true,
        keyboards: true,
        proSound: false,
      },
    },
  };
  const ocMeService = {
    Get: jasmine.createSpy('Get').and.returnValue(of(me)),
    Patch: jasmine.createSpy('Patch').and.returnValue(of(me)),
    Register: jasmine.createSpy('Register').and.returnValue(of(null)),
    ResetPasswordByToken: jasmine.createSpy('ResetPasswordByToken').and.returnValue(of(null))
  };
  const activatedRoute = {
    data: new BehaviorSubject({ shouldAllowUpdate: true }),
  };
  const toastrService = { success: jasmine.createSpy('success') };
  const tokenService = {
    GetAccess: jasmine.createSpy('GetAccess').and.returnValue('mockToken'),
  };
  const router = { navigate: jasmine.createSpy('navigate') };
  const formErrorService = {
    hasRequiredError: jasmine.createSpy('hasRequiredError'),
    hasValidEmailError: jasmine.createSpy('hasValidEmailError'),
    hasPasswordMismatchError: jasmine.createSpy('hasPasswordMismatchError'),
    hasPatternError: jasmine.createSpy('hasPatternError'),
    hasMinLengthError: jasmine.createSpy('hasMinLengthError'),
    displayFormErrors: jasmine.createSpy('displayFormErrors'),
  };
  const modalService = {
    open: jasmine.createSpy('open'),
    close: jasmine.createSpy('close'),
    add: jasmine.createSpy('add'),
    remove: jasmine.createSpy('remove'),
    onCloseSubject: new Subject<string>()
  };
  let ocAuthService = {
    Login: () => { },
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PhoneFormatPipe,
        RegisterComponent,
        ChangePasswordFormComponent,
        ModalComponent,
        FaIconComponent,
      ],
      imports: [ReactiveFormsModule, CookieModule.forRoot()],
      providers: [
        { provide: AppFormErrorService, useValue: formErrorService },
        { provide: Router, useValue: router },
        { provide: OcTokenService, useValue: tokenService },
        { provide: OcMeService, useValue: ocMeService },
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: AppStateService, useValue: appStateService },
        { provide: ToastrService, useValue: toastrService },
        { provide: ModalService, useValue: modalService },
        { provide: OcAuthService, useValue: ocAuthService },
        {
          provide: applicationConfiguration,
          useValue: new InjectionToken<AppConfig>('app.config'),
        },
      ],
    }).compileComponents();
    ocAuthService = TestBed.get(OcAuthService);
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
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
      spyOn(component as any, 'identifyShouldAllowUpdate');
    });
    it('should call setForm', () => {
      component.ngOnInit();
      expect(component['setForm']).toHaveBeenCalled();
    });
    it('should identify whether component should allow update or just creation', () => {
      component.ngOnInit();
      expect(component['identifyShouldAllowUpdate']).toHaveBeenCalled();
    })
    it('should call getMeData if shouldAllowUpdate is true', () => {
      activatedRoute.data.next({ shouldAllowUpdate: true });
      component.ngOnInit();
      expect(component['getMeData']).toHaveBeenCalled();
    });
    it('should not call getMeDate if shouldAllowUpdate is false', () => {
      activatedRoute.data.next({ shouldAllowUpdate: false });
      component.ngOnInit();
      expect(component['getMeData']).not.toHaveBeenCalled();
    });
  });

  describe('openChangePasswordModal', () => {
    let mockModalId;
    beforeEach(() => {
      mockModalId = 'mock id';
      component.changePasswordModalId = mockModalId;
      component.openChangePasswordModal();
    })
    it('should open modal', () => {
      expect(modalService.open).toHaveBeenCalledWith(mockModalId)
    })
  })

  describe('setForm', () => {
    it('should set form with password and confirmPassword if shouldAllowUpdate is false', () => {
      component.shouldAllowUpdate = false;
      component['setForm']();
      expect(component.form.value).toEqual({
        FirstName: '',
        LastName: '',
        Email: '',
        Phone: '',
        Password: '',
        ConfirmPassword: '',
      });
    });
    it('should set form without password and confirmPassword if shouldAllowUpdate is true', () => {
      component.shouldAllowUpdate = true;
      component['setForm']();
      expect(component.form.value).toEqual({
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
    })
    afterEach(() => {
      ocMeService.ResetPasswordByToken.calls.reset();
    })
    it('should verify user knows current password for security purposes', () => {
      spyOn(ocAuthService, 'Login').and.returnValue(of(null));
      component.onChangePassword({ currentPassword: 'password123', newPassword: 'new-pw' });
      expect(ocAuthService.Login).toHaveBeenCalledWith(
        component.me.Username,
        'password123',
        component['appConfig'].clientID,
        component['appConfig'].scope)
    })
    it('should reset password if verification of current password succeeds', () => {
      spyOn(ocAuthService, 'Login').and.returnValue(of(null))
      component.onChangePassword({ currentPassword: 'incorrect-pw', newPassword: 'new-pw' });
      expect(ocMeService.ResetPasswordByToken).toHaveBeenCalledWith({ NewPassword: 'new-pw' });
    })
    it('should close modal on successful change', () => {
      component.changePasswordModalId = 'mockModalId'
      spyOn(ocAuthService, 'Login').and.returnValue(of(null))
      component.onChangePassword({ currentPassword: 'incorrect-pw', newPassword: 'new-pw' });
      expect(component['modalService'].close).toHaveBeenCalledWith('mockModalId');
    })
  })

  describe('onSubmit', () => {
    beforeEach(() => {
      activatedRoute.data.next({ shouldAllowUpdate: true });
    });
    it('should call displayFormErrors if form is invalid', () => {
      component.form.controls.FirstName.setValue('');
      component['onSubmit']();
      expect(formErrorService.displayFormErrors).toHaveBeenCalled();
    });
    it('should call update if shouldAllowUpdate is true', () => {
      activatedRoute.data.next({ shouldAllowUpdate: true });
      spyOn(component as any, 'update');
      component['onSubmit']();
      expect(component['update']).toHaveBeenCalled();
    });
    it('should call register if shouldAllowUpdate is false', () => {
      activatedRoute.data.next({ shouldAllowUpdate: false });
      spyOn(component as any, 'register');
      component['onSubmit']();
      expect(component['register']).toHaveBeenCalled();
    });
  });

  describe('register', () => {
    const mockMe = { ID: 'NewUser' };
    beforeEach(() => {
      component['register'](mockMe);
    });
    it('should call meService.Register', () => {
      expect(ocMeService.Register).toHaveBeenCalledWith('mockToken', mockMe);
    });
    it('should navigate to login', () => {
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });
  });

  describe('update', () => {
    const mockMe = { ID: 'NewUser' };
    beforeEach(() => {
      component['update'](mockMe);
    });
    it('should call meService.Patch', () => {
      expect(ocMeService.Patch).toHaveBeenCalledWith(mockMe);
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
        FirstName: me.FirstName,
        LastName: me.LastName,
        Phone: me.Phone,
        Email: me.Email,
      });
    });
  });

  describe('hasRequiredError', () => {
    beforeEach(() => {
      component['hasRequiredError']('firstName');
    });
    it('should call formErrorService.hasRequiredError', () => {
      expect(formErrorService.hasRequiredError).toHaveBeenCalledWith(
        'firstName',
        component.form
      );
    });
  });

  describe('hasValidEmailError', () => {
    beforeEach(() => {
      component['hasValidEmailError']();
    });
    it('should call formErrorService.hasRequiredError', () => {
      expect(formErrorService.hasValidEmailError).toHaveBeenCalledWith(
        component.form.get('Email')
      );
    });
  });

  describe('passwordMismatchError', () => {
    beforeEach(() => {
      component['passwordMismatchError']();
    });
    it('should call formErrorService.hasRequiredError', () => {
      expect(formErrorService.hasPasswordMismatchError).toHaveBeenCalledWith(
        component.form
      );
    });
  });
});
