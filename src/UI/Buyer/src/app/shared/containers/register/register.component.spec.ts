import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { RegisterComponent } from '@app/shared/containers/register/register.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MeService, TokenService } from '@ordercloud/angular-sdk';
import { CookieModule } from 'ngx-cookie';
import { applicationConfiguration, AppConfig } from '@app/config/app.config';
import { InjectionToken } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { PhoneFormatPipe, AppStateService, OcFormErrorService } from '@app/shared';
import { of, Subject } from 'rxjs';

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
        proSound: false
      }
    }
  };
  const meService = {
    Get: jasmine.createSpy('Get').and.returnValue(of(me)),
    Patch: jasmine.createSpy('Patch').and.returnValue(of(me)),
    Register: jasmine.createSpy('Register').and.returnValue(of(null))
  };
  const activatedRoute = { data: of({ shouldAllowUpdate: true }) };
  const toastrService = { success: jasmine.createSpy('success') };
  const tokenService = { GetAccess: jasmine.createSpy('GetAccess').and.returnValue('mockToken') };
  const router = { navigate: jasmine.createSpy('navigate') };
  const formErrorService = {
    hasRequiredError: jasmine.createSpy('hasRequiredError'),
    hasValidEmailError: jasmine.createSpy('hasValidEmailError'),
    hasPasswordMismatchError: jasmine.createSpy('hasPasswordMismatchError'),
    displayFormErrors: jasmine.createSpy('displayFormErrors')
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PhoneFormatPipe,
        RegisterComponent
      ],
      imports: [
        ReactiveFormsModule,
        CookieModule.forRoot()
      ],
      providers: [
        { provide: OcFormErrorService, useValue: formErrorService },
        { provide: Router, useValue: router },
        { provide: TokenService, useValue: tokenService },
        { provide: MeService, useValue: meService },
        { provide: ActivatedRoute, useValue: activatedRoute },
        { provide: AppStateService, useValue: appStateService },
        { provide: ToastrService, useValue: toastrService },
        { provide: applicationConfiguration, useValue: new InjectionToken<AppConfig>('app.config') },
      ]
    })
      .compileComponents();
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
    });
    it('should call setForm', () => {
      component.ngOnInit();
      expect(component['setForm']).toHaveBeenCalled();
    });
    it('should call getMeData if shouldAllowUpdate is true', () => {
      component.shouldAllowUpdate = true;
      component.ngOnInit();
      expect(component['getMeData']).toHaveBeenCalled();
    });
    it('should not call getMeDate if shouldAllowUpdate is false', () => {
      component.shouldAllowUpdate = false;
      component.ngOnInit();
      expect(component['getMeData']).not.toHaveBeenCalled();
    });
  });

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
        ConfirmPassword: ''
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

  describe('onSubmit', () => {
    beforeEach(() => {
      spyOn(component as any, 'update');
      spyOn(component as any, 'register');
    });
    it('should call displayFormErrors if form is invalid', () => {
      component.form.setErrors({ 'test': true });
      component['onSubmit']();
      expect(formErrorService.displayFormErrors).toHaveBeenCalled();
    });
    it('should call update if shouldAllowUpdate is true', () => {
      component.shouldAllowUpdate = true;
      component['onSubmit']();
      expect(component['update']).toHaveBeenCalled();
    });
    it('should call register if shouldAllowUpdate is false', () => {
      component.shouldAllowUpdate = false;
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
      expect(meService.Register).toHaveBeenCalledWith('mockToken', mockMe);
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
      expect(meService.Patch).toHaveBeenCalledWith(mockMe);
    });
  });

  describe('getMeData', () => {
    beforeEach(() => {
      component['getMeData']();
    });
    it('should call meService.Get', () => {
      expect(meService.Get).toHaveBeenCalled();
    });
    it('should set form with me data', () => {
      expect(component.form.value).toEqual({
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
      expect(formErrorService.hasRequiredError).toHaveBeenCalledWith('firstName', component.form);
    });
  });

  describe('hasValidEmailError', () => {
    beforeEach(() => {
      component['hasValidEmailError']();
    });
    it('should call formErrorService.hasRequiredError', () => {
      expect(formErrorService.hasValidEmailError).toHaveBeenCalledWith(component.form.get('Email'));
    });
  });

  describe('passwordMismatchError', () => {
    beforeEach(() => {
      component['passwordMismatchError']();
    });
    it('should call formErrorService.hasRequiredError', () => {
      expect(formErrorService.hasPasswordMismatchError)
        .toHaveBeenCalledWith(component.form);
    });
  });
});
