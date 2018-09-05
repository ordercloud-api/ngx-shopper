import { Component, OnInit, Inject, ViewChild, OnDestroy } from '@angular/core';
import {
  applicationConfiguration,
  AppConfig,
} from '@app-buyer/config/app.config';
import { Router } from '@angular/router';
import {
  faSearch,
  faShoppingCart,
  faPhone,
  faQuestionCircle,
  faUserCircle,
  faSignOutAlt,
  faHome
} from '@fortawesome/free-solid-svg-icons';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';
import { Observable } from 'rxjs';
import { BaseResolveService, AppStateService } from '@app-buyer/shared';
import {
  OcTokenService,
  Order,
  MeUser,
  ListCategory,
} from '@ordercloud/angular-sdk';
import { takeWhile, tap, debounceTime, delay } from 'rxjs/operators';
import { AddToCartEvent } from '@app-buyer/shared/models/add-to-cart-event.interface';

@Component({
  selector: 'layout-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit, OnDestroy {
  categories$: Observable<ListCategory>;
  isCollapsed = true;
  anonymous$: Observable<boolean> = this.appStateService.isAnonSubject;
  user$: Observable<MeUser> = this.appStateService.userSubject;
  currentOrder: Order;
  alive = true;
  addToCartQuantity: number;
  @ViewChild('p') public popover: NgbPopover;

  faSearch = faSearch;
  faShoppingCart = faShoppingCart;
  faPhone = faPhone;
  faQuestionCircle = faQuestionCircle;
  faSignOutAlt = faSignOutAlt;
  faUserCircle = faUserCircle;
  faHome = faHome;

  constructor(
    private appStateService: AppStateService,
    private ocTokenService: OcTokenService,
    private baseResolveService: BaseResolveService,
    private router: Router,
    @Inject(applicationConfiguration) protected appConfig: AppConfig
  ) { }

  ngOnInit() {
    this.appStateService.orderSubject
      .pipe(takeWhile(() => this.alive))
      .subscribe((order) => (this.currentOrder = order));

    this.buildAddToCartNotification();
  }

  buildAddToCartNotification() {
    this.appStateService.addToCartSubject
      .pipe(
        tap((event: AddToCartEvent) => {
          this.popover.close();
          this.popover.ngbPopover = `${event.quantity} Item(s) Added to Cart`;
        }),
        delay(300),
        tap(() => this.popover.open()),
        debounceTime(3000)
      )
      .subscribe(() => {
        this.popover.close();
      });
  }

  searchProducts(searchStr: string) {
    this.router.navigate(['/products'], { queryParams: { search: searchStr } });
  }

  logout() {
    this.ocTokenService.RemoveAccess();
    if (this.appStateService.isAnonSubject.value) {
      this.baseResolveService.resetUser();
    } else {
      this.router.navigate(['/login']);
    }
  }

  // TODO: we should move responsibility for 'showing' up to the parent component instead of hard-coding route-names.
  showHeader() {
    const hiddenRoutes = [
      '/login',
      '/register',
      '/forgot-password',
      '/reset-password',
    ];
    return !hiddenRoutes.some((el) => this.router.url.indexOf(el) > -1);
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
