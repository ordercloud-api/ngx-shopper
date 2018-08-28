import { Component, OnInit, Input, Inject } from '@angular/core';
import {
  ListAddress,
  Address,
  OcAddressService,
  OcUserGroupService,
} from '@ordercloud/angular-sdk';
import { faTrashAlt, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { ModalService } from '@app-seller/shared/services/modal/modal.service';
import {
  AppConfig,
  applicationConfiguration,
} from '@app-seller/config/app.config';
import { BaseBrowse } from '@app-seller/shared/models/base-browse.class';

@Component({
  selector: 'address-table',
  templateUrl: './address-table.component.html',
  styleUrls: ['./address-table.component.scss'],
})
export class AddressTableComponent extends BaseBrowse implements OnInit {
  addresses: ListAddress;
  selectedAddress: Address;
  faTrash = faTrashAlt;
  faPlusCircle = faPlusCircle;
  createModalID = 'CreateAddressModal';
  editModalID = 'EditAddressModal';

  // Only use this when assigning users to user groups.
  @Input() userGroupID: string;

  constructor(
    private ocAddressService: OcAddressService,
    private ocUserGroupService: OcUserGroupService,
    private modalService: ModalService,
    @Inject(applicationConfiguration) private appConfig: AppConfig
  ) {
    // The BaseBrowse super class contains functionality for search, sort, and pagination.
    super();
  }

  ngOnInit() {
    this.loadData();
  }

  openCreateModal() {
    this.modalService.open(this.createModalID);
  }

  openEditModal(address: Address) {
    this.selectedAddress = address;
    this.modalService.open(this.editModalID);
  }

  // Overrides a method in BaseBrowse
  // TODO - I think this observable stuff can be made cleaner with operators
  loadData(): void {
    // this.requestOptions is inherited from BaseBrowse
    this.ocAddressService
      .List(this.appConfig.buyerID, this.requestOptions)
      .subscribe((addresses) => (this.addresses = addresses));
  }

  // assignUser(userID: string, assigned: boolean) {
  //   if (assigned) {
  //     this.ocUserGroupService
  //       .SaveUserAssignment(this.appConfig.buyerID, {
  //         UserID: userID,
  //         UserGroupID: this.userGroupID,
  //       })
  //       .subscribe();
  //   } else {
  //     this.ocUserGroupService
  //       .DeleteUserAssignment(this.appConfig.buyerID, this.userGroupID, userID)
  //       .subscribe();
  //   }
  // }

  deleteAddress(addressID) {
    this.ocAddressService
      .Delete(this.appConfig.buyerID, addressID)
      .subscribe(() => {
        this.loadData();
      });
  }

  addAddress(address: Address) {
    this.modalService.close(this.createModalID);
    this.ocAddressService
      .Create(this.appConfig.buyerID, address)
      .subscribe(() => {
        this.loadData();
      });
  }

  editAddress(address: Address) {
    this.modalService.close(this.editModalID);
    this.ocAddressService
      .Patch(this.appConfig.buyerID, address.ID, address)
      .subscribe(() => {
        this.loadData();
      });
  }
}
