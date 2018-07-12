import { Component, OnInit } from '@angular/core';

import { faPlus, faArrowLeft } from '@fortawesome/free-solid-svg-icons';

import { MeService, ListBuyerAddress, BuyerAddress } from '@ordercloud/angular-sdk';
import { faTrashAlt, faEdit } from '@fortawesome/free-regular-svg-icons';
import { ModalService } from '@app/shared';

@Component({
  selector: 'profile-address-list',
  templateUrl: './address-list.component.html',
  styleUrls: ['./address-list.component.scss']
})
export class AddressListComponent implements OnInit {
  faPlus = faPlus;
  faArrowLeft = faArrowLeft;
  faTrashAlt = faTrashAlt;
  faEdit = faEdit;
  addresses: ListBuyerAddress;
  currentAddress: BuyerAddress;
  requestOptions: { page?: number, search?: string } = { page: undefined, search: undefined };
  resultsPerPage = 8;
  modalID = 'add-profile-address';

  constructor(
    private meService: MeService,
    private modalService: ModalService
  ) { }

  ngOnInit() {
    this.reloadAddresses();
  }

  protected showAddAddress() {
    this.currentAddress = null;
    this.modalService.open(this.modalID);
  }

  protected showEditAddress(address: BuyerAddress) {
    this.currentAddress = address;
    this.modalService.open(this.modalID);
  }

  protected refresh() {
    this.currentAddress = null;
    this.reloadAddresses();
  }

  protected addressFormSubmitted(address: BuyerAddress) {
    this.modalService.close(this.modalID);
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
        this.refresh();
      }, error => {
        throw error;
      });
  }

  private updateAddress(address: BuyerAddress) {
    address.ID = this.currentAddress.ID;
    this.meService.PatchAddress(address.ID, address).subscribe(
      () => {
        this.refresh();
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

  protected updateRequestOptions(newOptions: { page?: number, search?: string }) {
    this.requestOptions = Object.assign(this.requestOptions, newOptions);
    this.reloadAddresses();
  }


  private reloadAddresses() {
    this.meService.ListAddresses({ ...this.requestOptions, pageSize: this.resultsPerPage }).subscribe(res => this.addresses = res);
  }

}
