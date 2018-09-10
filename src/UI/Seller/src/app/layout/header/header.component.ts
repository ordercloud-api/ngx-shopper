import { Component, OnInit, Inject } from '@angular/core';
import {
  applicationConfiguration,
  AppConfig,
} from '@app-seller/config/app.config';
import {
  faBoxOpen,
  faSignOutAlt,
  faUser,
  faUsers,
  faMapMarkerAlt,
  faSitemap,
} from '@fortawesome/free-solid-svg-icons';
import { OcTokenService } from '@ordercloud/angular-sdk';
import { Router } from '@angular/router';
import { AppStateService } from '@app-seller/shared';

@Component({
  selector: 'layout-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  isCollapsed = true;
  faBoxOpen = faBoxOpen;
  faUser = faUser;
  faSignOutAlt = faSignOutAlt;
  faUsers = faUsers;
  faMapMarker = faMapMarkerAlt;
  faSitemap = faSitemap;

  constructor(
    private ocTokenService: OcTokenService,
    private router: Router,
    private appStateService: AppStateService,
    @Inject(applicationConfiguration) protected appConfig: AppConfig
  ) {}

  ngOnInit() {}

  logout() {
    this.ocTokenService.RemoveAccess();
    this.appStateService.isLoggedIn.next(false);
    this.router.navigate(['/login']);
  }
}
