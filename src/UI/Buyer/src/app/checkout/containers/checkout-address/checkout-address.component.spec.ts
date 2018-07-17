import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutAddressComponent } from '@app/checkout/containers/checkout-address/checkout-address.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AddressFormComponent } from '@app/shared/components/address-form/address-form.component';
import { of, BehaviorSubject } from 'rxjs';
import { MeService, OrderService } from '@ordercloud/angular-sdk';
import { AppStateService, OcFormErrorService, ModalService } from '@app/shared';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { OcGeographyService } from '@app/shared/services/oc-geography/oc-geography.service';
import { CheckoutSectionBaseComponent } from '@app/checkout/components/checkout-section-base/checkout-section-base.component';


describe('CheckoutAddressComponent', () => {
  let component: CheckoutAddressComponent;
  let fixture: ComponentFixture<CheckoutAddressComponent>;

  const mockAddresses = { Items: [{ ID: 'address1', Name: 'AddressOne' }, { ID: 'address2', Name: 'AddressTwo' }] };
  const mockOrder = {
    ID: 'orderid',
    BillingAddress: { ID: 'mockBillingAddress' },
    BillingAddressID: 'mockBillingAddress',
    ShippingAddressID: 'mockShippingAddress'
  };

  const meService = { ListAddresses: jasmine.createSpy('ListAddresses').and.returnValue(of(mockAddresses)) };
  const orderService = {
    SetBillingAddress: jasmine.createSpy('SetBillingAddress').and.returnValue(of({})),
    SetShippingAddress: jasmine.createSpy('SetShippingAddress').and.returnValue(of({})),
    Patch: jasmine.createSpy('Patch').and.returnValue(of({}))
  };
  const mockLineItems = { Items: [{ ShippingAddress: { ID: 'mockShippingAddress' } }], Meta: {} };
  const appStateService = { orderSubject: new BehaviorSubject(mockOrder), lineItemSubject: new BehaviorSubject(mockLineItems) };

  const modalService = { open: jasmine.createSpy('open'), close: jasmine.createSpy('close') };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CheckoutSectionBaseComponent,
        CheckoutAddressComponent,
        AddressFormComponent
      ],
      imports: [
        ReactiveFormsModule
      ],
      providers: [
        OcFormErrorService,
        { provide: ModalService, useValue: modalService },
        { provide: MeService, useValue: meService },
        { provide: OrderService, useValue: orderService },
        { provide: AppStateService, useValue: appStateService },
        OcGeographyService
      ],
      schemas: [NO_ERRORS_SCHEMA], // Ignore template errors: remove if tests are added to test template
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutAddressComponent);
    component = fixture.componentInstance;
    component.addressType = 'Shipping';
    component.isAnon = false;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    beforeEach(() => {
      spyOn(component as any, 'getSavedAddresses');
      spyOn(component as any, 'setSelectedAddress');
    });
    it('should get saved addresses if user is profiled', () => {
      component.isAnon = false;
      component.ngOnInit();
      expect(component['getSavedAddresses']).toHaveBeenCalled();
    });
    it('should not get saved addresses if user is anonymous', () => {
      component.isAnon = true;
      component.ngOnInit();
      expect(component['getSavedAddresses']).not.toHaveBeenCalled();
    });
    it('should set selectedAddress', () => {
      component.ngOnInit();
      expect(component['setSelectedAddress']).toHaveBeenCalled();
    });
  });

  describe('getSavedAddresses', () => {
    beforeEach(() => {
      meService.ListAddresses.calls.reset();
    });
    it('should call ListAddresses with billing filter if addressType is Billing', () => {
      component.addressType = 'Billing';
      component['getSavedAddresses']();
      expect(meService.ListAddresses).toHaveBeenCalledWith({
        filters: { Billing: true },
        page: undefined,
        search: undefined,
        pageSize: component.resultsPerPage
      });
    });
    it('should call ListAddresses with shiping filter if addressType is Shipping', () => {
      component.addressType = 'Shipping';
      component['getSavedAddresses']();
      expect(meService.ListAddresses).toHaveBeenCalledWith({
        filters: { Shipping: true },
        page: undefined,
        search: undefined,
        pageSize: component.resultsPerPage
      });
    });
  });

  describe('setSelectedAddress', () => {
    it('should select address from order if addressType is Billing', () => {
      component.addressType = 'Billing';
      component['setSelectedAddress']();
      expect(component.selectedAddress).toEqual(component.order.BillingAddress);
    });
    it('should select address from first line item if addressType is Shipping', () => {
      component.addressType = 'Shipping';
      component['setSelectedAddress']();
      expect(component.selectedAddress).toEqual(component.lineItems.Items[0].ShippingAddress);
    });
  });

  describe('saveAddress()', () => {
    beforeEach(() => {
      spyOn(component as any, 'setOneTimeAddress').and.returnValue(of({ ID: 'NewOrderWhoDis' }));
      spyOn(component as any, 'setSavedAddress').and.returnValue(of({ ID: 'NewOrderWhoDis' }));
    });
    it('should set one time address if user is anon', () => {
      component.isAnon = true;
      component.addressType = 'Shipping';
      component.saveAddress({ ID: 'mockShippingAddress' });
      expect(component['setOneTimeAddress']).toHaveBeenCalledWith({ ID: 'mockShippingAddress' });
    });
    it('should set one time address if there is no address.ID', () => {
      component.isAnon = false;
      component.addressType = 'Shipping';
      component.saveAddress({ Street1: 'MyOneTimeAddresss' });
      expect(component['setOneTimeAddress']).toHaveBeenCalledWith({ Street1: 'MyOneTimeAddresss' });
    });
    it('should set saved address if user is profiled and address.ID is defined', () => {
      expect(component.isAnon = false);
      component.addressType = 'Shipping';
      component.saveAddress({ ID: 'MyOneTimeAddresss' });
      expect(component['setOneTimeAddress']).not.toHaveBeenCalled();
      expect(component['setSavedAddress']).toHaveBeenCalledWith({ ID: 'MyOneTimeAddresss' });
    });
    it('should set new address on line item if addressType is shipping', (() => {
      component.addressType = 'Shipping';
      component.saveAddress({ ID: 'MyOneTimeAddresss' });
      expect(component.lineItems.Items[0].ShippingAddress).toEqual({ ID: 'MyOneTimeAddresss' });
    }));
    it('should set new order as the order', () => {
      spyOn(appStateService.orderSubject, 'next');
      component.addressType = 'Shipping';
      component.saveAddress({ ID: 'MyOneTimeAddresss' });
      expect(component.order).toEqual({ ID: 'NewOrderWhoDis' });
      expect(appStateService.orderSubject.next).toHaveBeenCalledWith({ ID: 'NewOrderWhoDis' });
    });
    it('should emit continue event', () => {
      spyOn(component.continue, 'emit');
      component.addressType = 'Shipping';
      component.saveAddress({ ID: 'MyOneTimeAddresss' });
      expect(component.continue.emit).toHaveBeenCalled();
    });
  });

  describe('setOneTimeAddress', () => {
    it('should call orderService.SetBillingAddress if addressType is Shipping', () => {
      component.addressType = 'Billing';
      component['setOneTimeAddress']({ ID: 'MockOneTimeAddress' });
      expect(orderService.SetBillingAddress).toHaveBeenCalledWith('outgoing', component.order.ID, { ID: 'MockOneTimeAddress' });
    });
    it('should call orderService.SetShippingAddress if addressType is Shipping', () => {
      component.addressType = 'Shipping';
      component['setOneTimeAddress']({ ID: 'MockOneTimeAddress' });
      expect(orderService.SetShippingAddress).toHaveBeenCalledWith('outgoing', component.order.ID, { ID: 'MockOneTimeAddress' });
    });
  });

  describe('setSavedAddress', () => {
    it('should patch order.ShippingAddressID if addressType is Shipping', () => {
      component.addressType = 'Shipping';
      component['setSavedAddress']({ ID: 'MockSavedAddress' });
      expect(orderService.Patch).toHaveBeenCalledWith('outgoing', component.order.ID, { ShippingAddressID: 'MockSavedAddress' });
    });
    it('should patch order.BillingAddressID if addressType is Billing', () => {
      component.addressType = 'Billing';
      component['setSavedAddress']({ ID: 'MockSavedAddress' });
      expect(orderService.Patch).toHaveBeenCalledWith('outgoing', component.order.ID, { BillingAddressID: 'MockSavedAddress' });
    });
  });

});
