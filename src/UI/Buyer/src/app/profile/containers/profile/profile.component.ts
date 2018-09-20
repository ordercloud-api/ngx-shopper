import { Component, OnInit } from '@angular/core';
import { ProfileTab } from '@app-buyer/profile/models/profile-tabs.enum';
import { AppAuthService } from '@app-buyer/auth';
@Component({
  selector: 'profile-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  selectedTab: string;
  tabs: ProfileTab[];

  constructor(private appAuthService: AppAuthService) {
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
    this.appAuthService.logout();
  }
}
