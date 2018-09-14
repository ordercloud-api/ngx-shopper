import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ListOrder, OcMeService } from '@ordercloud/angular-sdk';
import { Router, ActivatedRoute } from '@angular/router';
import { MeOrderListOptions } from '@app-buyer/order/models/me-order-list-options';
import { flatMap } from 'rxjs/operators';

@Component({
  selector: 'order-aproval',
  templateUrl: './order-approval.component.html',
  styleUrls: ['./order-approval.component.scss'],
})
export class OrderAprovalComponent implements OnInit {
  alive = true;
  orders$: Observable<ListOrder>;
  sortBy: string;

  constructor(
    private ocMeService: OcMeService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.orders$ = this.listOrders();
  }

  protected sortOrders(sortBy: string): void {
    this.addQueryParam({ sortBy });
  }

  protected changePage(page: number): void {
    this.addQueryParam({ page });
  }

  protected filterBySearch(search: string): void {
    this.addQueryParam({ search, page: undefined });
  }

  protected filterByDate(datesubmitted: string[]): void {
    this.addQueryParam({ datesubmitted });
  }

  private addQueryParam(newParam: object): void {
    const queryParams = {
      ...this.activatedRoute.snapshot.queryParams,
      ...newParam,
    };
    this.router.navigate([], { queryParams });
  }

  protected listOrders(): Observable<ListOrder> {
    return this.activatedRoute.queryParamMap.pipe(
      flatMap((queryParams) => {
        this.sortBy = queryParams.get('sortBy');
        // we set param values to undefined so the sdk ignores them (dont show in headers)
        const listOptions: MeOrderListOptions = {
          sortBy: this.sortBy || undefined,
          search: queryParams.get('search') || undefined,
          page: parseInt(queryParams.get('page'), 10) || undefined,
          filters: {
            datesubmitted: queryParams.getAll('datesubmitted') || undefined,
          },
        };
        return this.ocMeService.ListApprovableOrders(listOptions);
      })
    );
  }
}
