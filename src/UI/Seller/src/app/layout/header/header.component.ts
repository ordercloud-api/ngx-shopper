import { Component, OnInit, Inject } from '@angular/core';
import {
  applicationConfiguration,
  AppConfig,
} from '@app-seller/config/app.config';

@Component({
  selector: 'layout-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  isCollapsed = true;

  constructor(
    @Inject(applicationConfiguration) protected appConfig: AppConfig
  ) {}

  ngOnInit() {}
}
