import { Component, OnInit } from '@angular/core';

import { faPlus, faArrowLeft, faWindowClose, faEdit } from '@fortawesome/free-solid-svg-icons';

import { MeService, ListBuyerAddress, BuyerAddress } from '@ordercloud/angular-sdk';

@Component({
  selector: 'profile-address-list',
  templateUrl: './address-list.component.html',
  styleUrls: ['./address-list.component.scss']
})
export class AddressListComponent implements OnInit {
  faPlus = faPlus;
  faArrowLeft = faArrowLeft;
  faWindowClose = faWindowClose;
  faEdit = faEdit;
  addresses: ListBuyerAddress;
  currentAddress: BuyerAddress;
  showEdit = false;

  constructor(
    private meService: MeService) { }

  ngOnInit() {
    this.reloadAddresses();
  }

  protected showAddAddress() {
    this.showEdit = true;
    this.currentAddress = null;
  }

  protected showEditAddress(address: BuyerAddress) {
    this.showEdit = true;
    this.currentAddress = address;
  }

  protected hideEditOrAdd() {
    this.showEdit = false;
    this.currentAddress = null;
    this.reloadAddresses();
  }

  protected addressFormSubmitted(address: BuyerAddress) {
    if (this.currentAddress) {
      this.updateAddress(address);
    } else {
      this.addAddress(address);
    }
  }

  private addAddress(address: BuyerAddress) {
    address.Shipping = true;
    address.Billing = true;
    this.meService.CreateAddress(address).subscribe(
      () => {
        this.hideEditOrAdd();
      }, error => {
        throw error;
      });
  }

  private updateAddress(address: BuyerAddress) {
    address.ID = this.currentAddress.ID;
    this.meService.PatchAddress(address.ID, address).subscribe(
      () => {
        this.hideEditOrAdd();
      }, error => {
        throw error;
      });
  }

  protected deleteAddress(address: BuyerAddress) {
    this.meService.DeleteAddress(address.ID).subscribe(
      () => {
        this.reloadAddresses();
      }, error => {
        throw error;
      });
  }

  private reloadAddresses() {
    this.meService.ListAddresses().subscribe(res => this.addresses = res);
  }

}
