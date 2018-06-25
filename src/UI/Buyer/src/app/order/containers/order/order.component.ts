import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { faCube, faTruck } from '@fortawesome/free-solid-svg-icons';
import { Order } from '@ordercloud/angular-sdk';

@Component({
  selector: 'order-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
  faCube = faCube;
  faTruck = faTruck;
  order$: Observable<Order>;

  constructor(
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit() {
    this.order$ = this.activatedRoute.data
      .pipe(
        map(({ orderResolve }) => orderResolve.order)
      );
  }
}
