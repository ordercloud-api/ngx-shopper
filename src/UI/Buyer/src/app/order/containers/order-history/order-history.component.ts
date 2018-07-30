import { Component, OnInit } from '@angular/core';
import { OrderStatus } from '@app-buyer/order/models/order-status.model';
import { OcMeService, ListOrder } from '@ordercloud/angular-sdk';
import { MeOrderListOptions } from '@app-buyer/order/models/me-order-list-options';
import { Observable } from 'rxjs';
import { Router, ActivatedRoute } from '@angular/router';
import { flatMap } from 'rxjs/operators';
import { FavoriteOrdersService } from '@app-buyer/shared/services/favorites/favorites.service';

@Component({
  selector: 'order-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.scss'],
})
export class OrderHistoryComponent implements OnInit {
  alive = true;
  orders$: Observable<ListOrder>;
  showfavoritesOnly = false;
  sortBy: string;

  constructor(
    private ocMeService: OcMeService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private favoriteOrdersService: FavoriteOrdersService
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

  protected filterByFavorite(favoritesOnly: boolean): void {
    this.showfavoritesOnly = favoritesOnly;
    this.orders$ = this.listOrders();
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
            status: queryParams.get('status') || `!${OrderStatus.Unsubmitted}`,
            datesubmitted: queryParams.getAll('datesubmitted') || undefined,
            ID: this.showfavoritesOnly
              ? this.favoriteOrdersService.favorites.join('|')
              : undefined,
          },
        };
        return this.ocMeService.ListOrders(listOptions);
      })
    );
  }
}
