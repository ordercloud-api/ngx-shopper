import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { faCube, faTruck } from '@fortawesome/free-solid-svg-icons';
import { Order } from '@ordercloud/angular-sdk';
import { FavoriteOrdersService } from '@app-buyer/shared/services/favorites/favorites.service';
import { ToggleFavoriteComponent } from '@app-buyer/shared/components/toggle-favorite/toggle-favorite.component';

@Component({
  selector: 'order-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss'],
})
export class OrderComponent implements OnInit {
  faCube = faCube;
  faTruck = faTruck;
  approvalVersion: boolean;
  order$: Observable<Order>;
  @ViewChild(ToggleFavoriteComponent, { static: false })
  toggleFavorite: ToggleFavoriteComponent;

  constructor(
    private activatedRoute: ActivatedRoute,
    private router: Router,
    protected favoriteOrdersService: FavoriteOrdersService // used in template
  ) {}

  ngOnInit() {
    this.approvalVersion = this.router.url.includes('/approval');
    this.order$ = this.activatedRoute.data.pipe(
      map(({ orderResolve }) => orderResolve.order)
    );
  }

  favorite() {
    this.toggleFavorite.favorite = !this.toggleFavorite.favorite;
    this.toggleFavorite.favoriteChanged.emit(this.toggleFavorite.favorite);
  }
}
