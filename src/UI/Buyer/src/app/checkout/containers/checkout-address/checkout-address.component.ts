import { Component, OnInit, Input } from '@angular/core';
import { CheckoutSectionBaseComponent } from '@app/checkout/components/checkout-section-base/checkout-section-base.component';
import { forkJoin, Observable } from 'rxjs';
import { MeService, ListBuyerAddress, OrderService, Order, BuyerAddress, ListLineItem } from '@ordercloud/angular-sdk';
import { AppStateService } from '@app/shared';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'checkout-address',
  templateUrl: './checkout-address.component.html',
  styleUrls: ['./checkout-address.component.scss']
})
export class CheckoutAddressComponent extends CheckoutSectionBaseComponent implements OnInit {

  @Input() isAnon: boolean;
  @Input() addressType: 'Shipping' | 'Billing';
  existingAddresses: ListBuyerAddress;
  selectedAddress: BuyerAddress;
  order: Order;
  lineItems: ListLineItem;
  addressForm: FormGroup;

  constructor(
    private meService: MeService,
    private orderService: OrderService,
    private appStateService: AppStateService,
    private formBuilder: FormBuilder
  ) {
    super();
  }

  ngOnInit() {
    if (!this.isAnon) {
      this.getSavedAddresses();
    }

    this.setSelectedAddress();
    this.setForm();
  }

  private getSavedAddresses() {
    const filters = {};
    filters[this.addressType] = true;
    this.meService.ListAddresses({ filters })
      .subscribe(addressList => this.existingAddresses = addressList);
  }

  private setSelectedAddress() {
    this.order = this.appStateService.orderSubject.value;
    this.lineItems = this.appStateService.lineItemSubject.value;

    this.selectedAddress = this.addressType === 'Billing' ?
      this.order.BillingAddress :
      this.lineItems.Items[0].ShippingAddress; // shipping address is defined at the line item level
  }

  private setForm() {
    this.addressForm = this.formBuilder.group({
      existingAddressId: this.order[`${this.addressType}AddressID`] || null
    });
  }

  existingAddressSelected() {
    const addressId = this.addressForm.value.existingAddressId;
    this.selectedAddress = this.existingAddresses.Items.find(x => x.ID === addressId);
  }

  saveAddress(address) {
    const queue = [];
    if (this.isAnon || !address.ID) {
      queue.push(this.setOneTimeAddress(address));
    } else {
      queue.push(this.setSavedAddress(address));
    }
    return forkJoin(queue)
      .subscribe(([order]) => {
        if (this.addressType === 'Shipping') {
          this.lineItems.Items[0].ShippingAddress = address;
          this.appStateService.lineItemSubject.next(this.lineItems);
        }
        this.order = order;
        this.appStateService.orderSubject.next(this.order);
        this.continue.emit();
      })
  }

  private setOneTimeAddress(address: BuyerAddress): Observable<Order> {
    return this.orderService[`Set${this.addressType}Address`]('outgoing', this.order.ID, address)
  }

  private setSavedAddress(address): Observable<Order> {
    const addressKey = <any>(`${this.addressType}AddressID`);
    const partialOrder = {};
    partialOrder[addressKey] = address.ID;
    return this.orderService.Patch('outgoing', this.order.ID, partialOrder);
  }
}
