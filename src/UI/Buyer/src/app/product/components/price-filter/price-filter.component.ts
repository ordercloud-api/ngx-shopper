import {
  Component,
  OnInit,
  Output,
  EventEmitter,
  OnDestroy,
} from '@angular/core';
import {
  faPlusSquare,
  faMinusSquare,
} from '@fortawesome/free-regular-svg-icons';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Params } from '@angular/router';
import { tap, takeWhile } from 'rxjs/operators';

@Component({
  selector: 'product-price-filter',
  templateUrl: './price-filter.component.html',
  styleUrls: ['./price-filter.component.scss'],
})
/**
 * true filtering-by-price is not yet possible (coming soon) but we can
 * mock this in simple scenarios by setting price on xp
 * and then filtering on xp
 *
 * note: this will not work for complex pricing scenarios
 * where there are multiple prices for a single product
 */
export class PriceFilterComponent implements OnInit, OnDestroy {
  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute
  ) {}

  @Output() priceFilterChange = new EventEmitter<Params>();

  isCollapsed = false;
  alive = true;
  faPlusSquare = faPlusSquare;
  faMinusSquare = faMinusSquare;
  form: FormGroup;
  queryParams;

  ngOnInit() {
    this.setForm();
  }

  setForm() {
    this.activatedRoute.queryParams
      .pipe(
        takeWhile(() => this.alive),
        tap((queryParams) => {
          this.queryParams = queryParams;
        })
      )
      .subscribe((queryParams) => {
        this.form = this.formBuilder.group({
          min: queryParams.minPrice,
          max: queryParams.maxPrice,
        });
      });
  }

  setPriceFilter() {
    const queryParams = { ...this.queryParams };
    const max = this.form.get('max').value;
    const min = this.form.get('min').value;

    if (max && !isNaN(max) && max >= 0) {
      queryParams['maxPrice'] = max;
    } else {
      queryParams['maxPrice'] = undefined;
    }

    if (min && !isNaN(min) && min >= 0) {
      queryParams['minPrice'] = min;
    } else {
      queryParams['minPrice'] = undefined;
    }

    this.priceFilterChange.emit(queryParams);
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
