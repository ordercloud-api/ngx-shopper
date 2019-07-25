// angular
import { Injectable, Inject } from '@angular/core';

// third party
import { Observable, of, forkJoin } from 'rxjs';
import { map, flatMap, tap } from 'rxjs/operators';
import {
  OcMeService,
  MeUser,
  Order,
  OcOrderService,
  OcTokenService,
  ListLineItem,
  LineItem,
} from '@ordercloud/angular-sdk';
import { CartService } from '@app-buyer/shared/services/cart/cart.service';
import { AppStateService } from '@app-buyer/shared/services/app-state/app-state.service';
import * as jwtDecode from 'jwt-decode';
import { isUndefined as _isUndefined } from 'lodash';

// app
import {
  applicationConfiguration,
  AppConfig,
} from '@app-buyer/config/app.config';

@Injectable({
  providedIn: 'root',
})
export class BaseResolveService {
  constructor(
    private appStateService: AppStateService,
    private ocMeService: OcMeService,
    private cartService: CartService,
    private ocOrderService: OcOrderService,
    private ocTokenService: OcTokenService,
    @Inject(applicationConfiguration) private appConfig: AppConfig
  ) {}

  private setCurrentUser(): Observable<MeUser> {
    return this.ocMeService.Get();
  }

  private setCurrentOrder(): Observable<Order> {
    return this.ocMeService
      .ListOrders({
        sortBy: '!DateCreated',
        filters: { status: 'Unsubmitted' },
      })
      .pipe(
        map((orderList) => orderList.Items[0]),
        flatMap((existingOrder) => {
          if (existingOrder) {
            return of(existingOrder);
          }
          if (this.appConfig.anonymousShoppingEnabled) {
            // only create anon order when line item is added
            const orderID = this.getOrderIDFromToken();
            const anonOrder = <Order>{ ID: orderID };
            return of(anonOrder);
          }
          return this.ocOrderService.Create('outgoing', {});
        })
      );
  }

  private setLineItems(): Observable<ListLineItem> {
    const order = this.appStateService.orderSubject.value;
    if (order.DateCreated) {
      return this.cartService.listAllItems(order.ID);
    }
    const lineitemlist = {
      Meta: { Page: 1, PageSize: 25, TotalCount: 0, TotalPages: 1 },
      Items: [],
    };
    return of(lineitemlist);
  }

  // Used by BaseResolve when app first loads, at login and at logout
  // auth guards have confirmed at this point a token exists
  setUser(): Observable<any> {
    const isAnon = !_isUndefined(this.getOrderIDFromToken());
    this.appStateService.isAnonSubject.next(isAnon);
    const prevLineItems = this.appStateService.lineItemSubject.value;
    const transferCart =
      !isAnon && // user is now logged in
      this.appStateService.isAnonSubject.value && // previously, user was anonymous
      prevLineItems.Items.length > 0; // previously, user added to cart
    return forkJoin([this.setCurrentUser(), this.setCurrentOrder()]).pipe(
      tap((res) => {
        // Pushes data to subscribers
        this.appStateService.userSubject.next(res[0]);
        this.appStateService.orderSubject.next(res[1]);
      }),
      flatMap(() => {
        return transferCart
          ? this.transferAnonymousCart(prevLineItems)
          : of(null);
      }),
      flatMap(() => {
        return this.setLineItems();
      }),
      tap((res) => {
        this.appStateService.lineItemSubject.next(res);
      })
    );
  }

  getOrderIDFromToken(): string | void {
    return jwtDecode(this.ocTokenService.GetAccess()).orderid;
  }

  transferAnonymousCart(anonLineItems: ListLineItem): Observable<LineItem[]> {
    const requests = anonLineItems.Items.map((li) =>
      this.cartService.addToCart(li.xp.product, li.Quantity)
    );

    return forkJoin(requests);
  }

  resetUser(): void {
    this.setUser().subscribe();
  }
}
