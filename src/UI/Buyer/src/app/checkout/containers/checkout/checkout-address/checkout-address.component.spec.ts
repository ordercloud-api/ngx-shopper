import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CheckoutAddressComponent } from './checkout-address.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AddressFormComponent } from '@app/shared/components/address-form/address-form.component';
import { of, BehaviorSubject } from 'rxjs';
import { MeService, OrderService } from '@ordercloud/angular-sdk';
import { AppStateService, OcFormErrorService } from '@app/shared';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { OcGeographyService } from '@app/shared/services/oc-geography/oc-geography.service';


describe('CheckoutAddressComponent', () => {
  let component: CheckoutAddressComponent;
  let fixture: ComponentFixture<CheckoutAddressComponent>;

  const mockAddresses = { Items: [{ ID: 'addressid' }] };
  const mockOrder = { ID: 'orderid', BillingAddress: {} };

  const meService = { ListAddresses: jasmine.createSpy('ListAddresses').and.returnValue(of(mockAddresses)) };
  const orderService = {
    SetBillingAddress: jasmine.createSpy('SetBillingAddress').and.returnValue(of({})),
    SetShippingAddress: jasmine.createSpy('SetShippingAddress').and.returnValue(of({}))
  };
  const appStateService = { orderSubject: new BehaviorSubject(mockOrder) };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        CheckoutAddressComponent,
        AddressFormComponent
      ],
      imports: [
        ReactiveFormsModule
      ],
      providers: [
        OcFormErrorService,
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
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit()', () => {
    it('should set values ', () => {
      expect(component.existingAddresses).toEqual(mockAddresses);
      expect(component.order).toEqual(mockOrder);
      expect(component.selectedAddress).toEqual(mockOrder.BillingAddress);
      expect(component.addressForm).toBeDefined();
    });
  });

  describe('existingAddressSelected()', () => {
    it('should select address', () => {
      component.addressForm.setValue({ existingAddressId: mockAddresses.Items[0].ID });
      component.existingAddressSelected();
      expect(component.selectedAddress).toEqual(mockAddresses.Items[0]);
    });
  });

  describe('saveAddress()', () => {
    it('should call services and then emit', () => {
      spyOn(component.continue, 'emit');
      const address = mockAddresses.Items[0];

      component.saveAddress(address);
      expect(orderService.SetBillingAddress).toHaveBeenCalledWith('outgoing', mockOrder.ID, address);
      expect(orderService.SetShippingAddress).toHaveBeenCalledWith('outgoing', mockOrder.ID, address);
      expect(component.continue.emit).toHaveBeenCalled();
    });
  });
});
