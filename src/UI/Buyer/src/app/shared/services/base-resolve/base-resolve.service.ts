// angular
import { Injectable, Inject } from '@angular/core';

// third party
import { Observable, of, forkJoin } from 'rxjs';
import { map, flatMap, tap } from 'rxjs/operators';
import {
  MeService,
  MeUser,
  Order,
  OrderService,
  TokenService,
  ListLineItem,
  LineItem,
} from '@ordercloud/angular-sdk';
import { OcLineItemService } from '@app/shared/services/oc-line-item/oc-line-item.service';
import { AppStateService } from '@app/shared/services/app-state/app-state.service';
import * as jwtDecode from 'jwt-decode';

// app
import { applicationConfiguration, AppConfig } from '@app/config/app.config';
import { AppAuthService } from '@app/auth/services/app-auth.service';

@Injectable()
export class BaseResolveService {
  constructor(
    private appStateService: AppStateService,
    private appAuthService: AppAuthService,
    private meService: MeService,
    private ocLineItemService: OcLineItemService,
    private orderService: OrderService,
    private tokenService: TokenService,
    @Inject(applicationConfiguration) private appConfig: AppConfig) {
  }

  private setCurrentUser(): Observable<MeUser> {
    return this.meService.Get();
  }

  private setCurrentOrder(): Observable<Order> {
    return this.meService.ListOrders({ sortBy: '!DateCreated', filters: { status: 'Unsubmitted' } })
      .pipe(
        map(orderList => orderList.Items[0]),
        flatMap(existingOrder => {
          if (existingOrder) {
            return of(existingOrder);
          }
          if (this.appConfig.anonymousShoppingEnabled) {
            // only create anon order when line item is added
            const orderID = jwtDecode(this.tokenService.GetAccess()).orderid;
            const anonOrder = <Order>{ ID: orderID };
            return of(anonOrder);
          }
          return this.orderService.Create('outgoing', {});
        })
      );
  }

  private setLineItems(): Observable<ListLineItem> {
    const order = this.appStateService.orderSubject.value;
    if (order.DateCreated) {
      return this.ocLineItemService.listAll(order.ID);
    }
    const lineitemlist = { Meta: { Page: 1, PageSize: 25, TotalCount: 0, TotalPages: 1 }, Items: [] };
    return of(lineitemlist);
  }

  // Used by BaseResolve when app first loads, at login and at logout
  // auth guards have confirmed at this point a token exists
  setUser(): Observable<any> {
    const isAnon = this.appAuthService.isUserAnon();
    const prevLineItems = this.appStateService.lineItemSubject.value;
    const transferCart = (
      !isAnon && // user is now logged in
      this.appStateService.isAnonSubject.value && // previously, user was anonymous
      prevLineItems.Items.length > 0 // previously, user added to cart
    );
    this.appStateService.isAnonSubject.next(isAnon);
    return forkJoin([
      this.setCurrentUser(),
      this.setCurrentOrder(),
    ]).pipe(
        tap(res => {
          // Pushes data to subscribers
          this.appStateService.userSubject.next(res[0]);
          this.appStateService.orderSubject.next(res[1]);
        }),
        flatMap(() => {
          return transferCart ? this.transferAnonymousCart(prevLineItems) : of(null);
        }),
        flatMap(() => {
          return this.setLineItems();
        }),
        tap(res => {
          this.appStateService.lineItemSubject.next(res);
        })
      );
  }

  transferAnonymousCart(anonLineItems: ListLineItem): Observable<LineItem[]> {
    const q = [];

    anonLineItems.Items.forEach(li => {
      q.push(this.ocLineItemService.create(li.xp.product, li.Quantity));
    });

    return forkJoin(q);
  }

  resetUser() {
    this.setUser().subscribe();
  }
}
