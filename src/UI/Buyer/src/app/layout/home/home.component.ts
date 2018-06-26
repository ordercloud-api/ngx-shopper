import { Component, OnInit } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import { MeService, ListBuyerProduct } from '@ordercloud/angular-sdk';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  featuredProducts$: Observable<ListBuyerProduct>;

  constructor(
    private config: NgbCarouselConfig,
    private meService: MeService
  ) { }

  ngOnInit() {
    this.config.interval = 5000;
    this.config.wrap = true;
    this.featuredProducts$ = this.meService.ListProducts({filters: <any>{'xp.Featured': true}});
  }
}
