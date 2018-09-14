import { Component, OnInit, Inject } from '@angular/core';
import {
  faUsers,
  faUser,
  faMapMarkerAlt,
  faSitemap,
} from '@fortawesome/free-solid-svg-icons';
import { UserGroup, OcUserGroupService } from '@ordercloud/angular-sdk';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { flatMap, tap } from 'rxjs/operators';
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
  userGroupID: string;
  faUsers = faUsers;
  faUser = faUser;
  faMapMarker = faMapMarkerAlt;
  faSitemap = faSitemap;

  constructor(
    private activatedRoute: ActivatedRoute,
    private ocUserGroupService: OcUserGroupService,
    private router: Router,
    @Inject(applicationConfiguration) private appConfig: AppConfig
  ) {}

  ngOnInit() {
    this.getUserGroup().subscribe((x) => (this.usergroup = x));
  }

  getUserGroup(): Observable<UserGroup> {
    return this.activatedRoute.params.pipe(
      flatMap((params) => {
        if (params.userGroupID) {
          this.userGroupID = params.userGroupID;
          return this.ocUserGroupService.Get(
            this.appConfig.buyerID,
            params.userGroupID
          );
        }
      })
    );
  }

  updateUserGroup(group: UserGroup): void {
    this.ocUserGroupService
      .Patch(this.appConfig.buyerID, this.userGroupID, group)
      .subscribe((x) => {
        this.usergroup = x;
        if (this.userGroupID !== this.usergroup.ID) {
          this.router.navigateByUrl(`/usergroups/${this.usergroup.ID}`);
        }
      });
  }
}
