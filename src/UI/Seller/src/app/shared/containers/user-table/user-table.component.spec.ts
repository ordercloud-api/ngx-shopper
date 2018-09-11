import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { ModalService } from '@app-seller/shared';
import { OcUserService, OcUserGroupService } from '@ordercloud/angular-sdk';
import { applicationConfiguration } from '@app-seller/config/app.config';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { UserTableComponent } from '@app-seller/shared/containers/user-table/user-table.component';

describe('UserTableComponent', () => {
  let component: UserTableComponent;
  let fixture: ComponentFixture<UserTableComponent>;
  const mockUserList = { Items: [{ ID: 'userID' }] };
  const mockUserAssignmentList = {
    Items: [{ UserID: 'userID', UserGroupID: 'group' }],
  };
  const ocUserService = {
    List: jasmine.createSpy('List').and.returnValue(of(mockUserList)),
    Create: jasmine
      .createSpy('Create')
      .and.returnValue(of(mockUserList.Items[0])),
    Delete: jasmine.createSpy('Delete').and.returnValue(of({})),
    Patch: jasmine
      .createSpy('Patch')
      .and.returnValue(of(mockUserList.Items[0])),
  };
  const ocUserGroupService = {
    ListUserAssignments: jasmine
      .createSpy('ListUserAssignments')
      .and.returnValue(of(mockUserAssignmentList)),
    SaveUserAssignment: jasmine
      .createSpy('SaveUserAssignment')
      .and.returnValue(of(mockUserAssignmentList.Items[0])),
    DeleteUserAssignment: jasmine
      .createSpy('DeleteUserAssignment')
      .and.returnValue(of({})),
  };

  const modalService = {
    open: jasmine.createSpy('open'),
    close: jasmine.createSpy('close'),
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserTableComponent],
      imports: [FontAwesomeModule],
      providers: [
        { provide: ModalService, useValue: modalService },
        { provide: OcUserService, useValue: ocUserService },
        { provide: OcUserGroupService, useValue: ocUserGroupService },
        {
          provide: applicationConfiguration,
          useValue: { buyerID: 'buyerID' },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('loadData', () => {
    it('should set users using OCUsersService', () => {
      component.users = undefined;
      component.loadData();
      expect(ocUserService.List).toHaveBeenCalled();
    });
    it('should not get usergroup assignments if no userGroupID', () => {
      component.userGroupID = undefined;
      component.columns = ['Assign'];
      component.loadData();
      expect(ocUserGroupService.ListUserAssignments).not.toHaveBeenCalled();
    });
    it('should not get usergroup assignments if no assigned column', () => {
      component.userGroupID = 'group';
      component.columns = [];
      component.loadData();
      expect(ocUserGroupService.ListUserAssignments).not.toHaveBeenCalled();
    });
    it('should get usergroup assignments if column and ID', () => {
      component.userGroupID = 'group';
      component.columns = ['Assign'];
      component.loadData();
      expect(ocUserGroupService.ListUserAssignments).toHaveBeenCalled();
      expect((component.users.Items[0] as any).Assigned).toEqual(true);
    });
  });

  describe('assignUser', () => {
    beforeEach(() => {
      component.userGroupID = 'group';
    });
    it('should create assignment when parameter is true', () => {
      component.assignUser('userID', true);
      expect(ocUserGroupService.SaveUserAssignment).toHaveBeenCalledWith(
        'buyerID',
        { UserID: 'userID', UserGroupID: 'group' }
      );
    });
    it('should delete assignment when parameter is false', () => {
      component.assignUser('userID', false);
      expect(ocUserGroupService.DeleteUserAssignment).toHaveBeenCalledWith(
        'buyerID',
        'group',
        'userID'
      );
    });
  });

  describe('deleteUser', () => {
    beforeEach(() => {
      spyOn(component, 'loadData');
      component.deleteUser('userID');
    });
    it('should delete user using OCUsersService', () => {
      expect(ocUserService.Delete).toHaveBeenCalledWith('buyerID', 'userID');
      expect(component.loadData).toHaveBeenCalled();
    });
  });

  describe('addUser', () => {
    beforeEach(() => {
      spyOn(component, 'loadData');
      component.addUser(mockUserList.Items[0]);
    });
    it('should add user using OCUsersService', () => {
      expect(modalService.close).toHaveBeenCalled();
      expect(ocUserService.Create).toHaveBeenCalledWith(
        'buyerID',
        mockUserList.Items[0]
      );
      expect(component.loadData).toHaveBeenCalled();
    });
  });

  describe('editUser', () => {
    beforeEach(() => {
      spyOn(component, 'loadData');
      component.editUser(component.users.Items[0], 'oldID');
    });
    it('should edit a users using OCUsersService', () => {
      expect(modalService.close).toHaveBeenCalled();
      expect(ocUserService.Patch).toHaveBeenCalledWith(
        'buyerID',
        'oldID',
        component.users.Items[0]
      );
      expect(component.loadData).toHaveBeenCalled();
    });
  });
});
