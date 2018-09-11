import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressTableComponent } from './address-table.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import {
  OcAddressService,
  Address,
  ListAddress,
} from '@ordercloud/angular-sdk';
import { ModalService } from '@app-seller/shared/services/modal/modal.service';
import { applicationConfiguration } from '@app-seller/config/app.config';
import { of } from 'rxjs';

describe('AddressTableComponent', () => {
  let component: AddressTableComponent;
  let fixture: ComponentFixture<AddressTableComponent>;
  const mockAddresses = { Items: [{ ID: 'address1' }] };
  const mockAssignments = {
    Items: [
      {
        AddressID: 'address1',
        UserGroupID: 'groupID',
        IsShipping: true,
        IsBilling: true,
      },
    ],
  };
  const ocAddressService = {
    List: jasmine.createSpy('List').and.returnValue(of(mockAddresses)),
    Delete: jasmine.createSpy('Delete').and.returnValue(of({})),
    Create: jasmine.createSpy('Create').and.returnValue(of({})),
    Patch: jasmine.createSpy('Patch').and.returnValue(of({})),
    ListAssignments: jasmine
      .createSpy('ListAssignments')
      .and.returnValue(of(mockAssignments)),
    SaveAssignment: jasmine.createSpy('SaveAssignments'),
    DeleteAssignment: jasmine.createSpy('Delete Assignments'),
  };

  const modalService = {
    open: jasmine.createSpy('open'),
    close: jasmine.createSpy('close'),
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddressTableComponent],
      imports: [FontAwesomeModule],
      providers: [
        { provide: OcAddressService, useValue: ocAddressService },
        { provide: ModalService, useValue: modalService },
        {
          provide: applicationConfiguration,
          useValue: { buyerID: 'buyerID' },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('loadData', () => {
    it('should set addresses and set assignments using OCUsersService', () => {
      component.addresses = undefined;
      component.loadData();
      expect(ocAddressService.List).toHaveBeenCalled();
      expect(ocAddressService.ListAssignments).toHaveBeenCalled();
    });
    it('should call findGroupAssignment() if groupID', () => {
      spyOn(component, 'findGroupAssignment');
      spyOn(component, 'findBuyerAssignment');
      component.userGroupID = 'groupID';
      component.loadData();
      expect(component.findGroupAssignment).toHaveBeenCalled();
      expect(component.findBuyerAssignment).not.toHaveBeenCalled();
    });
    it('should call getBuyerAssignment if not groupID', () => {
      spyOn(component, 'findGroupAssignment');
      spyOn(component, 'findBuyerAssignment');
      component.userGroupID = undefined;
      component.loadData();
      expect(component.findGroupAssignment).not.toHaveBeenCalled();
      expect(component.findBuyerAssignment).toHaveBeenCalled();
    });
    it('should group assignments if group id matches', () => {
      component.addresses = undefined;
      component.userGroupID = 'groupID';
      component.loadData();
      expect(component.addresses.Items[0]).toEqual(<Address>{
        ID: 'address1',
        IsShipping: true,
        IsBilling: true,
      });
    });
  });

  describe('assignShipping', () => {
    beforeEach(() => {
      spyOn(component, 'updateAssignment');
      component.addresses = {
        Items: [{ ID: 'address1', IsBilling: true } as Address],
      };
      component.userGroupID = 'groupID';
    });
    it('should call updateAssignment with IsShipping set to false', () => {
      component.assignShipping('address1', false);
      expect(component.updateAssignment).toHaveBeenCalledWith({
        AddressID: 'address1',
        UserGroupID: 'groupID',
        IsBilling: true,
        IsShipping: false,
      });
    });
    it('should call updateAssignment with IsShipping set to true', () => {
      component.assignShipping('address1', true);
      expect(component.updateAssignment).toHaveBeenCalledWith({
        AddressID: 'address1',
        UserGroupID: 'groupID',
        IsBilling: true,
        IsShipping: true,
      });
    });
  });

  describe('assignBilling', () => {
    beforeEach(() => {
      spyOn(component, 'updateAssignment');
      component.addresses = {
        Items: [{ ID: 'address1', IsShipping: true } as Address],
      };
      component.userGroupID = 'groupID';
    });
    it('should call updateAssignment with IsShipping set to false', () => {
      component.assignBilling('address1', false);
      expect(component.updateAssignment).toHaveBeenCalledWith({
        AddressID: 'address1',
        UserGroupID: 'groupID',
        IsBilling: false,
        IsShipping: true,
      });
    });
    it('should call updateAssignment with IsShipping set to true', () => {
      component.assignBilling('address1', true);
      expect(component.updateAssignment).toHaveBeenCalledWith({
        AddressID: 'address1',
        UserGroupID: 'groupID',
        IsBilling: true,
        IsShipping: true,
      });
    });
  });

  describe('deleteAddress', () => {
    beforeEach(() => {
      spyOn(component, 'loadData');
      component.deleteAddress('addressID');
    });
    it('should delete address using OCAddressesService', () => {
      expect(ocAddressService.Delete).toHaveBeenCalledWith(
        'buyerID',
        'addressID'
      );
      expect(component.loadData).toHaveBeenCalled();
    });
  });

  describe('addAddress', () => {
    beforeEach(() => {
      spyOn(component, 'loadData');
      component.addAddress(mockAddresses.Items[0]);
    });
    it('should add address using OCAddressService', () => {
      expect(modalService.close).toHaveBeenCalled();
      expect(ocAddressService.Create).toHaveBeenCalledWith(
        'buyerID',
        mockAddresses.Items[0]
      );
      expect(component.loadData).toHaveBeenCalled();
    });
  });

  describe('editUser', () => {
    beforeEach(() => {
      spyOn(component, 'loadData');
      component.editAddress(mockAddresses.Items[0], 'oldID');
    });
    it('should edit a users using OCUsersService', () => {
      expect(modalService.close).toHaveBeenCalled();
      expect(ocAddressService.Patch).toHaveBeenCalledWith(
        'buyerID',
        'oldID',
        mockAddresses.Items[0]
      );
      expect(component.loadData).toHaveBeenCalled();
    });
  });
});
