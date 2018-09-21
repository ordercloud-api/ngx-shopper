import { Component, AfterViewInit, Input } from '@angular/core';
import { OrderStatus } from '@app-buyer/order/models/order-status.model';
import { OcMeService, ListOrder } from '@ordercloud/angular-sdk';
import { MeOrderListOptions } from '@app-buyer/order/models/me-order-list-options';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { flatMap } from 'rxjs/operators';
import { FavoriteOrdersService } from '@app-buyer/shared/services/favorites/favorites.service';

@Component({
  selector: 'order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss'],
})
export class OrderHistoryComponent implements AfterViewInit {
  alive = true;
  columns: string[] = ['ID', 'Status', 'DateSubmitted', 'Total'];
  orders$: Observable<ListOrder>;
  hasFavoriteOrdersFilter = false;
  sortBy: string;
  @Input() approvalVersion: boolean;

  constructor(
    private ocMeService: OcMeService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private favoriteOrdersService: FavoriteOrdersService
  ) {}

  ngAfterViewInit(): void {
    if (!this.approvalVersion) {
      this.columns.push('Favorite');
    }
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

  protected filterByStatus(status: OrderStatus): void {
    this.addQueryParam({ status });
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

  protected filterByFavorite(favoriteOrders: boolean): void {
    if (favoriteOrders) {
      this.addQueryParam({ favoriteOrders: true });
    } else {
      // set to undefined so we dont pollute url with unnecessary query params
      this.addQueryParam({ favoriteOrders: undefined });
    }
  }

  protected listOrders(): Observable<ListOrder> {
    return this.activatedRoute.queryParamMap.pipe(
      flatMap((queryParamMap) => {
        this.sortBy = queryParamMap.get('sortBy');
        // we set param values to undefined so the sdk ignores them (dont show in headers)
        const listOptions: MeOrderListOptions = {
          sortBy: this.sortBy || undefined,
          search: queryParamMap.get('search') || undefined,
          page: parseInt(queryParamMap.get('page'), 10) || undefined,
          filters: {
            ID: this.buildFavoriteOrdersQuery(queryParamMap),
            status:
              queryParamMap.get('status') || `!${OrderStatus.Unsubmitted}`,
            datesubmitted: queryParamMap.getAll('datesubmitted') || undefined,
          },
        };
        return this.approvalVersion
          ? this.ocMeService.ListApprovableOrders(listOptions)
          : this.ocMeService.ListOrders(listOptions);
      })
    );
  }

  private buildFavoriteOrdersQuery(
    queryParamMap: ParamMap
  ): string | undefined {
    this.hasFavoriteOrdersFilter =
      queryParamMap.get('favoriteOrders') === 'true';
    const favorites = this.favoriteOrdersService.getFavorites();
    return this.hasFavoriteOrdersFilter && favorites && favorites.length
      ? favorites.join('|')
      : undefined;
  }
}
