import { Component, OnInit } from '@angular/core';
import { BaseBrowse, ModalService } from '@app-seller/shared';
import { OcUserService, User, ListUser } from '@ordercloud/angular-sdk';
import {
  faTrashAlt,
  faPlusCircle,
  faCircle,
} from '@fortawesome/free-solid-svg-icons';

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
  createModalID = 'CreateUserModal';
  editModalID = 'EditUserModal';

  constructor(
    private ocUserService: OcUserService,
    private modalService: ModalService
  ) {
    // The BaseBrowse super class contains functionality for search, sort, and pagination.
    super();
  }

  ngOnInit() {
    this.loadData();
  }

  openModal(id: string, user?: User) {
    this.selectedUser = user;
    this.modalService.open(id);
  }

  // Overrides a method in BaseBrowse
  loadData(): void {
    // this.requestOptions is inherited from BaseBrowse
    this.ocUserService
      .List('A', this.requestOptions)
      .subscribe((x) => (this.users = x));
  }

  deleteUser(userID) {
    this.ocUserService.Delete('A', userID).subscribe(() => {
      this.loadData();
    });
  }

  addUser(user: User) {
    this.modalService.close(this.createModalID);
    this.ocUserService.Create('A', user).subscribe(() => {
      this.loadData();
    });
  }

  editUser(user: User) {
    this.modalService.close(this.editModalID);
    this.ocUserService.Patch('A', user.ID, user).subscribe(() => {
      this.loadData();
    });
  }
}
