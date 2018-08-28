import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserGroupTableComponent } from './user-group-table.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';
import { OcUserGroupService } from '@ordercloud/angular-sdk';
import { applicationConfiguration } from '@app-seller/config/app.config';
import { ModalService } from '@app-seller/shared';

describe('UserGroupTableComponent', () => {
  let component: UserGroupTableComponent;
  let fixture: ComponentFixture<UserGroupTableComponent>;
  const mockUserGroups = { Items: [{ ID: 'UserGroup' }] };
  const ocUserGroupService = {
    List: jasmine.createSpy('List').and.returnValue(of(mockUserGroups)),
    Delete: jasmine.createSpy('Delete').and.returnValue(of({})),
    Create: jasmine.createSpy('Create').and.returnValue(of({})),
  };
  const modalService = {
    open: jasmine.createSpy('open'),
    close: jasmine.createSpy('close'),
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UserGroupTableComponent],
      imports: [FontAwesomeModule],
      providers: [
        { provide: OcUserGroupService, useValue: ocUserGroupService },
        { provide: applicationConfiguration, useValue: { buyerID: 'buyerID' } },
        { provide: ModalService, useValue: modalService },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserGroupTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('loadProducts', () => {
    beforeEach(() => {
      component.usergroups = undefined;
      component.loadData();
    });
    it('should set products using OCProductsService', () => {
      expect(ocUserGroupService.List).toHaveBeenCalled();
      expect(component.usergroups).toEqual(mockUserGroups);
    });
  });

  describe('deleteProducts', () => {
    beforeEach(() => {
      spyOn(component, 'loadData');
      component.usergroups = undefined;
      component.deleteUserGroup('testID');
    });
    it('should delete group using OCUserGroupsService', () => {
      expect(ocUserGroupService.Delete).toHaveBeenCalledWith(
        'buyerID',
        'testID'
      );
      expect(component.loadData).toHaveBeenCalled();
    });
  });

  describe('addProducts', () => {
    beforeEach(() => {
      spyOn(component, 'loadData');
      component.addUserGroup(mockUserGroups.Items[0]);
    });
    it('should deleted products using OCUserGroupsService', () => {
      expect(modalService.close).toHaveBeenCalled();
      expect(ocUserGroupService.Create).toHaveBeenCalledWith(
        'buyerID',
        mockUserGroups.Items[0]
      );
      expect(component.loadData).toHaveBeenCalled();
    });
  });
});
