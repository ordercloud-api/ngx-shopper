import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressListComponent } from '@app/profile/containers/address-list/address-list.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';
import { AddressDisplayComponent } from '@app/shared/components/address-display/address-display.component';
import { PhoneFormatPipe, ModalService } from '@app/shared';
import { ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { MeService } from '@ordercloud/angular-sdk';
import { AddressFormComponent } from '@app/shared/components/address-form/address-form.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('AddressListComponent', () => {
  let component: AddressListComponent;
  let fixture: ComponentFixture<AddressListComponent>;
  const toastrService = { success: jasmine.createSpy('success') };
  const meService = {
    DeleteAddress: jasmine.createSpy('DeleteAddress').and.returnValue(of(null)),
    ListAddresses: jasmine.createSpy('ListAddresses').and.returnValue(of(null))
  };

  const modalService = { open: jasmine.createSpy('open'), close: jasmine.createSpy('close') };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PhoneFormatPipe,
        FaIconComponent,
        AddressListComponent,
      ],
      imports: [
        ReactiveFormsModule,
      ],
      providers: [
        { provide: ModalService, useValue: modalService },
        { provide: MeService, useValue: meService },
        { provide: ToastrService, useValue: toastrService }
      ],
      schemas: [NO_ERRORS_SCHEMA], // Ignore template errors: remove if tests are added to test template
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    beforeEach(() => {
      spyOn(component as any, 'reloadAddresses');
      component.ngOnInit();
    });
    it('should call reload addresses', () => {
      expect(component['reloadAddresses']).toHaveBeenCalled();
    });
  });

  describe('showAddress', () => {
    beforeEach(() => {
      component.currentAddress = { ID: 'mockBuyerAddress' };
      component['showAddAddress']();
    });
    it('should display modal', () => {
      expect(modalService.open).toHaveBeenCalledWith(component.modalID);
    });
    it('should clear out current address', () => {
      expect(component.currentAddress).toBe(null);
    });
  });

  describe('showEditAddress', () => {
    const mockEditAddress = { ID: 'mockEditAddress' };
    beforeEach(() => {
      component.currentAddress = null;
      component['showEditAddress'](mockEditAddress);
    });
    it('should display modal', () => {
      expect(modalService.open).toHaveBeenCalledWith(component.modalID);
    });
    it('should show edit address', () => {
      expect(component.currentAddress).toBe(mockEditAddress);
    });
  });

  describe('refresh()', () => {
    beforeEach(() => {
      spyOn(component as any, 'reloadAddresses');
      component.currentAddress = { ID: 'mockBuyerAddress' };
      component['refresh']();
    });
    it('should clear out edit address', () => {
      expect(component.currentAddress).toBe(null);
    });
    it('should reload addresses', () => {
      expect(component['reloadAddresses']).toHaveBeenCalled();
    });
  });

  describe('deleteAddress', () => {
    beforeEach(() => {
      spyOn(component as any, 'reloadAddresses');
      component['deleteAddress']({ ID: 'mockAddress' });
    });
    it('should call meService.DeleteAddress', () => {
      expect(meService.DeleteAddress).toHaveBeenCalledWith('mockAddress');
    });
    it('should reload addresses', () => {
      expect(component['reloadAddresses']).toHaveBeenCalled();
    });
  });

  describe('reloadAddresses', () => {
    beforeEach(() => {
      component['reloadAddresses']();
    });
    it('should call meService.ListAddresses', () => {
      expect(meService.ListAddresses).toHaveBeenCalled();
    });
  });

  describe('updateRequestOptions', () => {
    beforeEach(() => {
      component.requestOptions = { page: undefined, search: undefined };
    });
    it('should pass page parameter', () => {
      component['updateRequestOptions']({ page: 3 });
      expect(component.requestOptions).toEqual({ search: undefined, page: 3 });
      expect(meService.ListAddresses).toHaveBeenCalledWith({ search: undefined, page: 3, pageSize: component.resultsPerPage });
    });
    it('should pass search parameter', () => {
      component['updateRequestOptions']({ search: 'searchTerm' });
      expect(component.requestOptions).toEqual({ search: 'searchTerm', page: undefined });
      expect(meService.ListAddresses).toHaveBeenCalledWith({ search: 'searchTerm', page: undefined, pageSize: component.resultsPerPage });
    });
  });
});
