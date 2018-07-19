import { Component, OnInit } from '@angular/core';
import { ProfileTab } from '@app/profile/models/profile-tabs.enum';

@Component({
  selector: 'profile-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})

export class ProfileComponent implements OnInit {
  selectedTab: string;
  tabs: ProfileTab[];

  constructor() {
    this.tabs = [
      { display: 'Details', route: 'details' },
      { display: 'Addresses', route: 'addresses' },
      { display: 'Payment Methods', route: 'payment-methods' },
      { display: 'Orders', route: 'orders' }];
  }

  ngOnInit(): void {
    this.selectTab(this.tabs[0]);
  }

  selectTab(tab: ProfileTab): void {
    this.selectedTab = tab.display;
  }
}
