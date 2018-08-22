import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserGroupDetailsComponent } from './user-group-details.component';
import { RouterTestingModule } from '@angular/router/testing';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { OcUserGroupService } from '@ordercloud/angular-sdk';
import { of, BehaviorSubject } from 'rxjs';
import { applicationConfiguration } from '@app-seller/config/app.config';
import { ActivatedRoute } from '@angular/router';

describe('UserGroupDetailsComponent', () => {
  let component: UserGroupDetailsComponent;
  let fixture: ComponentFixture<UserGroupDetailsComponent>;
  const mockUserGroup = {
    ID: 'userGroupID',
    Name: 'MyGroup',
  };
  const ocUserGroupService = {
    Get: jasmine.createSpy('Get').and.returnValue(of({})),
    Patch: jasmine.createSpy('Patch').and.returnValue(of({})),
  };
  const activatedRoute = {
    params: new BehaviorSubject({ userGroupID: 'userGroupID' }),
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserGroupDetailsComponent],
      imports: [RouterTestingModule, FontAwesomeModule],
      providers: [
        { provide: OcUserGroupService, useValue: ocUserGroupService },
        { provide: applicationConfiguration, useValue: { buyerID: 'buyerID' } },
        { provide: ActivatedRoute, useValue: activatedRoute },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserGroupDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      spyOn(component, 'getUserGroup').and.returnValue(of(mockUserGroup));
      component.ngOnInit();
    });
    it('should set usergroup', () => {
      expect(component.getUserGroup).toHaveBeenCalled();
    });
  });

  describe('GetUserGroup', () => {
    it('should call OcUserGroupService', () => {
      component.getUserGroup();
      expect(ocUserGroupService.Get).toHaveBeenCalled();
    });
  });

  describe('updateUserGroup', () => {
    it('should update the usergroup', () => {
      component.updateUserGroup(mockUserGroup);
      expect(ocUserGroupService.Patch).toHaveBeenCalledWith(
        'buyerID',
        component.userGroupID,
        mockUserGroup
      );
    });
  });
});
