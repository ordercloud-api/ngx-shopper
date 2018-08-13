import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UserTableComponent } from './user-table.component';
import { of } from 'rxjs';
import { ModalService } from '@app-seller/shared';
import { OcUserService } from '@ordercloud/angular-sdk';
import { applicationConfiguration } from '@app-seller/config/app.config';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

describe('UserTableComponent', () => {
  let component: UserTableComponent;
  let fixture: ComponentFixture<UserTableComponent>;
  const mockUserList = { Items: [{ ID: 'userID' }] };
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

  describe('loadUsers', () => {
    beforeEach(() => {
      component.users = undefined;
      component.loadData();
    });
    it('should set users using OCUsersService', () => {
      expect(ocUserService.List).toHaveBeenCalled();
      expect(component.users).toEqual(mockUserList);
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
      component.editUser({ ID: 'userID' });
    });
    it('should edit a users using OCUsersService', () => {
      expect(modalService.close).toHaveBeenCalled();
      expect(ocUserService.Patch).toHaveBeenCalledWith(
        'buyerID',
        'userID',
        mockUserList.Items[0]
      );
      expect(component.loadData).toHaveBeenCalled();
    });
  });
});
