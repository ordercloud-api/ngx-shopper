import { Component, OnInit, Inject, ViewChild, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { applicationConfiguration, AppConfig } from '@app/config/app.config';
import { Router } from '@angular/router';
import { faSearch, faShoppingCart, faPhone, faQuestionCircle, faUserCircle, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import { NgbPopover } from '@ng-bootstrap/ng-bootstrap';

import { Observable } from 'rxjs';

import { BaseResolveService, AppStateService } from '@app/shared';

import { TokenService, Order, MeUser, ListCategory } from '@ordercloud/angular-sdk';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'layout-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  categories$: Observable<ListCategory>;
  isCollapsed = true;
  searchProductsForm: FormGroup;
  anonymous$: Observable<boolean> = this.appStateService.isAnonSubject;
  user$: Observable<MeUser> = this.appStateService.userSubject;
  currentOrder: Order;
  alive = true;
  @ViewChild('p') public popover: NgbPopover;

  faSearch = faSearch;
  faShoppingCart = faShoppingCart;
  faPhone = faPhone;
  faQuestionCircle = faQuestionCircle;
  faSignOutAlt = faSignOutAlt;
  faUserCircle = faUserCircle;

  constructor(
    private appStateService: AppStateService,
    private ocTokenService: TokenService,
    private baseResolveService: BaseResolveService,
    private router: Router,
    private formBuilder: FormBuilder,
    @Inject(applicationConfiguration) protected appConfig: AppConfig
  ) { }

  ngOnInit() {
    this.searchProductsForm = this.formBuilder.group({
      search: ''
    });

    this.appStateService.orderSubject.pipe(
      takeWhile(() => this.alive)
    ).subscribe(order => {
        if (
          order &&
          this.currentOrder &&
          !isNaN(this.currentOrder.LineItemCount) &&
          order.LineItemCount > this.currentOrder.LineItemCount &&
          this.popover
        ) {
          this.addedToCart();
        }
        this.currentOrder = order;
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
      '/reset-password'
    ];
    return !hiddenRoutes.some(el => this.router.url.indexOf(el) > -1);
  }

  addedToCart() {
    this.popover.open();
    setTimeout(() => {
      if (this.popover) {
        this.popover.close();
      }
    }, 5000);
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
