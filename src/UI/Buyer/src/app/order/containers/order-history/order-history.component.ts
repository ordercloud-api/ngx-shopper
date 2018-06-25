import { Component, OnInit } from '@angular/core';
import { OrderStatus } from '@app/order/models/order-status.model';
import { MeService, ListOrder } from '@ordercloud/angular-sdk';
import { MeOrderListOptions } from '@app/order/models/me-order-list-options';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { flatMap } from 'rxjs/operators';

@Component({
  selector: 'order-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss']
})
export class OrderHistoryComponent implements OnInit {
  alive = true;
  orders$: Observable<ListOrder>;
  sortBy: string;

  constructor(
    private meService: MeService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.orders$ = this.listOrders();
  }

  protected sortOrders(sortBy: string): void {
    const queryParams = { ...this.activatedRoute.snapshot.queryParams, sortBy };
    this.router.navigate([], { queryParams });
  }

  protected changePage(page: number): void {
    const queryParams = { ...this.activatedRoute.snapshot.queryParams, page };
    this.router.navigate([], { queryParams });
  }

  protected filterBySearch(search: string): void {
    const queryParams = { ...this.activatedRoute.snapshot.queryParams, search, page: undefined };
    this.router.navigate([], { queryParams });
  }

  protected filterByStatus(status: OrderStatus): void {
    const queryParams = { ...this.activatedRoute.snapshot.queryParams, status };
    this.router.navigate([], { queryParams });
  }

  protected filterByDate(datesubmitted: string[]): void {
    const queryParams = { ...this.activatedRoute.snapshot.queryParams, datesubmitted };
    this.router.navigate([], { queryParams });
  }

  protected listOrders(): Observable<ListOrder> {
    return this.activatedRoute.queryParamMap
      .pipe(
        flatMap(queryParams => {
          this.sortBy = queryParams.get('sortBy');
          // we set param values to undefined so the sdk ignores them (dont show in headers)
          const listOptions: MeOrderListOptions = {
            sortBy: this.sortBy || undefined,
            search: queryParams.get('search') || undefined,
            page: parseInt(queryParams.get('page'), 10) || undefined,
            filters: {
              status: queryParams.get('status') || `!${OrderStatus.Unsubmitted}`,
              datesubmitted: queryParams.getAll('datesubmitted') || undefined
            }
          };
          return this.meService.ListOrders(listOptions);
        })
      );
  }
}
