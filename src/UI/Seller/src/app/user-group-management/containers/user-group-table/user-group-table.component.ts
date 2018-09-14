import { Component, OnInit, Inject } from '@angular/core';
import {
  ListUserGroup,
  OcUserGroupService,
  UserGroup,
} from '@ordercloud/angular-sdk';
import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';
import { faPlusCircle } from '@fortawesome/free-solid-svg-icons';
import {
  applicationConfiguration,
  AppConfig,
} from '@app-seller/config/app.config';
import { BaseBrowse, ModalService } from '@app-seller/shared';

@Component({
  selector: 'user-group-table',
  templateUrl: './user-group-table.component.html',
  styleUrls: ['./user-group-table.component.scss'],
})
export class UserGroupTableComponent extends BaseBrowse implements OnInit {
  usergroups: ListUserGroup;
  faTrash = faTrashAlt;
  faPlusCircle = faPlusCircle;
  modalID = 'CreateUserGroupModal';

  constructor(
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

  openModal(): void {
    this.modalService.open(this.modalID);
  }

  // Overrides a method in BaseBrowse
  loadData(): void {
    // this.requestOptions is inherited from BaseBrowse
    this.ocUserGroupService
      .List(this.appConfig.buyerID, this.requestOptions)
      .subscribe((x) => (this.usergroups = x));
  }

  deleteUserGroup(groupID: string) {
    this.ocUserGroupService
      .Delete(this.appConfig.buyerID, groupID)
      .subscribe(() => {
        this.loadData();
      });
  }

  addUserGroup(group: UserGroup) {
    this.modalService.close(this.modalID);
    this.ocUserGroupService
      .Create(this.appConfig.buyerID, group)
      .subscribe(() => {
        this.loadData();
      });
  }
}
