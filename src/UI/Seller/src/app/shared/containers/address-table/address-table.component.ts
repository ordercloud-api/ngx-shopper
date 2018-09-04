import { Component, OnInit, Input, Inject } from '@angular/core';
import {
  ListAddress,
  Address,
  OcAddressService,
  ListAddressAssignment,
  AddressAssignment,
} from '@ordercloud/angular-sdk';
import { faTrashAlt, faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import { ModalService } from '@app-seller/shared/services/modal/modal.service';
import {
  AppConfig,
  applicationConfiguration,
} from '@app-seller/config/app.config';
import { BaseBrowse } from '@app-seller/shared/models/base-browse.class';
import { forkJoin } from 'rxjs';

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

  // If this is undefined, assignments will be to the buyer org. If defined, assignements are to the userGroup.
  @Input()
  userGroupID: string;

  constructor(
    private ocAddressService: OcAddressService,
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
  // TODO - I think the nested subscribes can be made cleaner with operators
  loadData(): void {
    // this.requestOptions is inherited from BaseBrowse
    this.ocAddressService
      .List(this.appConfig.buyerID, this.requestOptions)
      .subscribe((addresses) => {
        const queue = addresses.Items.map((address) => {
          return this.ocAddressService.ListAssignments(this.appConfig.buyerID, {
            addressID: address.ID,
          });
        });
        forkJoin(queue).subscribe((res: any) => {
          this.addresses = addresses;
          res = res.filter((assignments) => assignments.Items.length > 0);
          res.forEach((assignments) => {
            const assignment = this.userGroupID
              ? this.getGroupAssignment(assignments)
              : this.getBuyerAssignment(assignments);
            if (!assignment) return;
            const index = this.addresses.Items.findIndex(
              (address) => address.ID === assignment.AddressID
            );
            (this.addresses.Items[index] as any).IsShipping =
              assignment.IsShipping;
            (this.addresses.Items[index] as any).IsBilling =
              assignment.IsBilling;
          });
        });
      });
  }

  getBuyerAssignment(assignments: ListAddressAssignment): AddressAssignment {
    return assignments.Items.filter((x) => !x.UserGroupID)[0];
  }

  getGroupAssignment(assignments: ListAddressAssignment): AddressAssignment {
    return assignments.Items.filter(
      (x) => x.UserGroupID === this.userGroupID
    )[0];
  }

  assignShipping(addressID: string, assigned: boolean): void {
    const address = this.addresses.Items.find((x) => x.ID === addressID);
    this.updateAssignment(<AddressAssignment>{
      AddressID: addressID,
      UserGroupID: this.userGroupID || undefined,
      IsBilling: (address as any).IsBilling,
      IsShipping: assigned,
    });
  }

  assignBilling(addressID: string, assigned: boolean): void {
    const address = this.addresses.Items.find((x) => x.ID === addressID);
    this.updateAssignment(<AddressAssignment>{
      AddressID: addressID,
      UserGroupID: this.userGroupID || undefined,
      IsBilling: assigned,
      IsShipping: (address as any).IsShipping || false,
    });
  }

  updateAssignment(assignment: AddressAssignment) {
    const request =
      assignment.IsBilling || assignment.IsShipping
        ? this.ocAddressService.SaveAssignment(
            this.appConfig.buyerID,
            assignment
          )
        : this.ocAddressService.DeleteAssignment(
            this.appConfig.buyerID,
            assignment.AddressID,
            {
              userGroupID: assignment.UserGroupID || undefined,
            }
          );
    request.subscribe(() => this.loadData());
  }

  deleteAddress(addressID): void {
    this.ocAddressService
      .Delete(this.appConfig.buyerID, addressID)
      .subscribe(() => {
        this.loadData();
      });
  }

  addAddress(address: Address): void {
    this.modalService.close(this.createModalID);
    this.ocAddressService
      .Create(this.appConfig.buyerID, address)
      .subscribe(() => {
        this.loadData();
      });
  }

  editAddress(address: Address): void {
    this.modalService.close(this.editModalID);
    this.ocAddressService
      .Patch(this.appConfig.buyerID, address.ID, address)
      .subscribe(() => {
        this.loadData();
      });
  }

  getAlertText(): string {
    return this.userGroupID ? 'this user group.' : 'all users.';
  }
}
