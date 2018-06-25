import { Component, OnInit, Input } from '@angular/core';
import { CheckoutSectionBaseComponent } from '@app/checkout/components/checkout-section-base/checkout-section-base.component';
import { forkJoin } from 'rxjs';
import { MeService, ListBuyerAddress, OrderService, Order, BuyerAddress } from '@ordercloud/angular-sdk';
import { AppStateService } from '@app/shared';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'checkout-address',
  templateUrl: './checkout-address.component.html',
  styleUrls: ['./checkout-address.component.scss']
})
export class CheckoutAddressComponent extends CheckoutSectionBaseComponent implements OnInit {

  @Input() isAnon: boolean;
  existingAddresses: ListBuyerAddress;
  selectedAddress: BuyerAddress;
  order: Order;
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
      this.meService.ListAddresses().subscribe(res => this.existingAddresses = res);
    }

    this.order = this.appStateService.orderSubject.value;
    this.selectedAddress = this.order.BillingAddress;
    this.addressForm = this.formBuilder.group({ existingAddressId: this.order.BillingAddressID || null });
  }

  existingAddressSelected() {
    const addressId = this.addressForm.value.existingAddressId;
    this.selectedAddress = this.existingAddresses.Items.find(x => x.ID === addressId);
  }

  saveAddress(address) {
    forkJoin([
      this.orderService.SetBillingAddress('outgoing', this.order.ID, address),
      this.orderService.SetShippingAddress('outgoing', this.order.ID, address)
    ]).subscribe(results => {
      this.order.BillingAddress = results[0].BillingAddress;
      this.order.BillingAddressID = results[0].BillingAddressID;
      this.order.ShippingAddressID = results[1].ShippingAddressID;
      this.appStateService.orderSubject.next(this.order);
      this.continue.emit();
    }, error => {
      throw error;
    });
  }
}
