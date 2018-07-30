import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import {
  faPlusSquare,
  faMinusSquare,
} from '@fortawesome/free-regular-svg-icons';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'products-price-filter',
  templateUrl: './price-filter.component.html',
  styleUrls: ['./price-filter.component.scss'],
})
export class PriceFilterComponent implements OnInit {
  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute
  ) {}

  @Output() selectedFacet = new EventEmitter<any>();

  isCollapsed = false;
  faPlusSquare = faPlusSquare;
  faMinusSquare = faMinusSquare;
  form: FormGroup;

  ngOnInit() {
    this.form = this.formBuilder.group({
      min: this.activatedRoute.snapshot.queryParams.pricemin,
      max: this.activatedRoute.snapshot.queryParams.pricemax,
    });
  }

  setPriceFilter() {
    const queryParams = Object.assign(
      {},
      this.activatedRoute.snapshot.queryParams
    );
    const max = this.form.get('max').value;
    const min = this.form.get('min').value;

    if (max && !isNaN(max) && max >= 0) {
      queryParams['pricemax'] = max;
    } else {
      delete queryParams['pricemax'];
    }

    if (min && !isNaN(min) && min >= 0) {
      queryParams['pricemin'] = min;
    } else {
      delete queryParams['pricemin'];
    }

    this.selectedFacet.emit({ queryParams });
  }

  clear() {
    this.form.setValue({
      min: '',
      max: '',
    });
    this.setPriceFilter();
  }
}
