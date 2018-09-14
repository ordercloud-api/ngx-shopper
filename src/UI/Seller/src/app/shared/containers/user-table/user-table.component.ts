import { Component, OnInit, Inject, Input } from '@angular/core';
import {
  OcUserService,
  User,
  ListUser,
  OcUserGroupService,
  ListUserGroupAssignment,
} from '@ordercloud/angular-sdk';
import {
  faTrashAlt,
  faPlusCircle,
  faCircle,
  faUser,
} from '@fortawesome/free-solid-svg-icons';
import {
  AppConfig,
  applicationConfiguration,
} from '@app-seller/config/app.config';
import { BaseBrowse } from '@app-seller/shared/models/base-browse.class';
import { ModalService } from '@app-seller/shared/services/modal/modal.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'user-table',
  templateUrl: './user-table.component.html',
  styleUrls: ['./user-table.component.scss'],
})
export class UserTableComponent extends BaseBrowse implements OnInit {
  users: ListUser;
  selectedUser: User;
  faTrash = faTrashAlt;
  faCircle = faCircle;
  faPlusCircle = faPlusCircle;
  faUser = faUser;
  createModalID = 'CreateUserModal';
  editModalID = 'EditUserModal';
  // Default Columns.
  @Input()
  columns = [
    'ID',
    'Username',
    'FirstName',
    'LastName',
    'Email',
    'Active',
    'Delete',
  ];

  // Only use this when assigning users to user groups.
  @Input()
  userGroupID: string;

  constructor(
    private ocUserService: OcUserService,
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

  openEditModal(user: User) {
    this.selectedUser = user;
    this.modalService.open(this.editModalID);
  }

  // Overrides a method in BaseBrowse
  // TODO - I think this observable stuff can be made cleaner with operators
  loadData(): void {
    // this.requestOptions is inherited from BaseBrowse
    this.ocUserService
      .List(this.appConfig.buyerID, this.requestOptions)
      .subscribe((users) => {
        if (this.columns.indexOf('Assign') < 0 || !this.userGroupID) {
          return (this.users = users);
        }
        const queue = users.Items.map((user) => this.getAssignment(user));
        forkJoin(queue).subscribe((res: ListUserGroupAssignment[]) => {
          res.forEach((group, index) => {
            if (group.Items.length === 0) return;
            (users.Items[index] as any).Assigned = true;
          });
          this.users = users;
        });
      });
  }

  getAssignment(user: User) {
    return this.ocUserGroupService.ListUserAssignments(this.appConfig.buyerID, {
      userGroupID: this.userGroupID,
      userID: user.ID,
    });
  }

  assignUser(userID: string, assigned: boolean) {
    const request = assigned
      ? this.ocUserGroupService.SaveUserAssignment(this.appConfig.buyerID, {
          UserID: userID,
          UserGroupID: this.userGroupID,
        })
      : this.ocUserGroupService.DeleteUserAssignment(
          this.appConfig.buyerID,
          this.userGroupID,
          userID
        );
    request.subscribe();
  }

  deleteUser(userID) {
    this.ocUserService.Delete(this.appConfig.buyerID, userID).subscribe(() => {
      this.loadData();
    });
  }

  addUser(user: User) {
    this.modalService.close(this.createModalID);
    this.ocUserService.Create(this.appConfig.buyerID, user).subscribe(() => {
      this.loadData();
    });
  }

  editUser(user: User, prevID: string) {
    this.modalService.close(this.editModalID);
    this.ocUserService
      .Patch(this.appConfig.buyerID, prevID, user)
      .subscribe(() => {
        this.loadData();
      });
  }

  getImpersonationToken(userID: string) {
    this.ocUserService
      .GetAccessToken(this.appConfig.buyerID, userID, {
        ClientID: this.appConfig.buyerClientID,
        Roles: ['FullAccess'],
      })
      .subscribe((res) => {
        window.open(
          `${this.appConfig.buyerUrl}/impersonation?token=${res.access_token}`,
          '_blank'
        );
      });
  }
}
