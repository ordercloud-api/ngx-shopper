import { Component, OnInit } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';
import {
  OcMeService,
  ListBuyerProduct,
  OcBuyerService,
  Buyer,
} from '@ordercloud/angular-sdk';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { faBullhorn } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'layout-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  featuredProducts$: Observable<ListBuyerProduct>;
  buyerOrg$: Observable<Buyer>;
  faBullhorn = faBullhorn;

  constructor(
    private config: NgbCarouselConfig,
    private ocMeService: OcMeService,
    private ocBuyerService: OcBuyerService
  ) {}

  ngOnInit() {
    this.config.interval = 5000;
    this.config.wrap = true;
    this.featuredProducts$ = this.ocMeService.ListProducts({
      filters: <any>{ 'xp.Featured': true },
    });
    this.buyerOrg$ = this.GetBuyerOrg();
  }

  GetBuyerOrg(): Observable<Buyer> {
    // In a buyer context, listing buyers will return only one buyer organization, your own.
    return this.ocBuyerService.List().pipe(map((list) => list.Items[0]));
  }
}
