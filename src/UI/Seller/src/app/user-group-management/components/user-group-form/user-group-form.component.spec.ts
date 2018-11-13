import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserGroupFormComponent } from './user-group-form.component';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { AppFormErrorService } from '@app-seller/shared';

describe('UserGroupFormComponent', () => {
  let component: UserGroupFormComponent;
  let fixture: ComponentFixture<UserGroupFormComponent>;
  const formErrorService = {
    hasRequiredError: jasmine.createSpy('hasRequiredError'),
    displayFormErrors: jasmine.createSpy('displayFormErrors'),
    hasInvalidIdError: jasmine.createSpy('hasInvalidIdError'),
    hasPatternError: jasmine.createSpy('hasPatternError'),
  };

  const mockUserGroup = {
    ID: '1',
    Name: 'group',
    Description: 'Description',
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserGroupFormComponent],
      imports: [ReactiveFormsModule],
      providers: [
        FormBuilder,
        { provide: AppFormErrorService, useValue: formErrorService },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserGroupFormComponent);
    component = fixture.componentInstance;
    component.existingUserGroup = mockUserGroup;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      component.ngOnInit();
    });

    it('should initialize form correctly', () => {
      expect(component.userGroupForm.value).toEqual(mockUserGroup);
    });
  });

  describe('onSubmit', () => {
    beforeEach(() => {
      spyOn(component.formSubmitted, 'emit');
    });
    it('should call displayFormErrors if form is invalid', () => {
      component.userGroupForm.setErrors({ test: true });
      component['onSubmit']();
      expect(formErrorService.displayFormErrors).toHaveBeenCalled();
    });
    it('should emit formSubmitted event', () => {
      component['onSubmit']();
      expect(component.formSubmitted.emit).toHaveBeenCalledWith({
        ...mockUserGroup,
      });
    });
  });

  describe('hasRequiredError', () => {
    beforeEach(() => {
      component['hasRequiredError']('Name');
    });
    it('should call formErrorService.hasRequiredError', () => {
      expect(formErrorService.hasRequiredError).toHaveBeenCalledWith(
        'Name',
        component.userGroupForm
      );
    });
  });
});
