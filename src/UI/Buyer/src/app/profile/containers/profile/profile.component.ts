import { Component, OnInit } from '@angular/core';
import { ProfileTab } from '@app-buyer/profile/models/profile-tabs.enum';
import { BaseResolveService, AppStateService } from '@app-buyer/shared';
import { OcTokenService } from '@ordercloud/angular-sdk';
import { Router } from '@angular/router';
@Component({
  selector: 'profile-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  selectedTab: string;
  tabs: ProfileTab[];

  constructor(
    private appStateService: AppStateService,
    private ocTokenService: OcTokenService,
    private baseResolveService: BaseResolveService,
    private router: Router,
  ) {
    this.tabs = [
      { display: 'Details', route: ['/profile', 'details'] },
      { display: 'Addresses', route: ['/profile', 'addresses'] },
      { display: 'Payment Methods', route: ['/profile', 'payment-methods'] },
      { display: 'My Orders', route: ['/profile', 'orders'] },
      {
        display: 'Orders To Approve',
        route: ['/profile', 'orders', 'approval'],
      },
    ];
  }

  ngOnInit(): void {
    this.selectTab(this.tabs[0]);
  }

  selectTab(tab: ProfileTab): void {
    this.selectedTab = tab.display;
  }

  logout() {
    this.ocTokenService.RemoveAccess();
    if (this.appStateService.isAnonSubject.value) {
      this.baseResolveService.resetUser();
    } else {
      this.router.navigate(['/login']);
    }
  }
}