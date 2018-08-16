import { Component, OnInit, Inject } from '@angular/core';
import { faUsers, faUser } from '@fortawesome/free-solid-svg-icons';
import { UserGroup, OcUserGroupService } from '@ordercloud/angular-sdk';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { flatMap } from 'rxjs/operators';
import {
  AppConfig,
  applicationConfiguration,
} from '@app-seller/config/app.config';

@Component({
  selector: 'user-group-details',
  templateUrl: './user-group-details.component.html',
  styleUrls: ['./user-group-details.component.scss'],
})
export class UserGroupDetailsComponent implements OnInit {
  usergroup: UserGroup;
  faUsers = faUsers;
  faUser = faUser;

  constructor(
    private activatedRoute: ActivatedRoute,
    private ocUserGroupService: OcUserGroupService,
    @Inject(applicationConfiguration) private appConfig: AppConfig
  ) {}

  ngOnInit() {
    this.getProductData().subscribe((x) => (this.usergroup = x));
  }

  getProductData(): Observable<UserGroup> {
    return this.activatedRoute.params.pipe(
      flatMap((params) => {
        if (params.userGroupID) {
          return this.ocUserGroupService.Get(
            this.appConfig.buyerID,
            params.userGroupID
          );
        }
      })
    );
  }

  updateUserGroup(group: UserGroupUpdate): void {
    if (!group.prevID) {
      throw Error('Cannot update a user group without an ID');
    }

    this.ocUserGroupService
      .Patch(this.appConfig.buyerID, group.prevID, group)
      .subscribe((x) => (this.usergroup = x));
  }
}

interface UserGroupUpdate extends UserGroup {
  // ID can be changed in the form, so we need the previous ID to ensure we update the correct record
  prevID: string;
}
