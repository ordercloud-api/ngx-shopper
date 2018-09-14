import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  Inject,
} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ProductSortStrategy } from '@app-buyer/product/models/product-sort-strategy.enum';
import { each as _each } from 'lodash';
import {
  applicationConfiguration,
  AppConfig,
} from '@app-buyer/config/app.config';

@Component({
  selector: 'product-sort-filter',
  templateUrl: './sort-filter.component.html',
  styleUrls: ['./sort-filter.component.scss'],
})
export class SortFilterComponent implements OnInit {
  form: FormGroup;
  options: { label: string; value: string }[];
  @Input() sortStrategy?: string;
  @Output() sortStrategyChange = new EventEmitter<ProductSortStrategy>();

  constructor(
    private formBuilder: FormBuilder,
    @Inject(applicationConfiguration) private appConfig: AppConfig
  ) {}

  ngOnInit() {
    this.options = this.getOptions();
    this.setForm();
  }

  private getOptions(): { label: string; value: string }[] {
    let options = [];
    _each(ProductSortStrategy, (strategyName, strategyVal) => {
      options = [...options, { label: strategyName, value: strategyVal }];
    });
    if (this.appConfig.premiumSearchEnabled) {
      // sorting by price is mocked by storing price on xp and
      // sorting by xp.Price
      // uncomment the below lines if your product model has xp.Price defined
      // options = [
      //   ...options,
      //   { label: 'Price: High to Low', value: '!xp.Price' },
      // ];
      // options = [
      //   ...options,
      //   { label: 'Price: Low to High', value: 'xp.Price' },
      // ];
    }
    return options;
  }

  private setForm() {
    this.form = this.formBuilder.group({
      strategy: this.options.find((x) => x.value === this.sortStrategy),
    });
  }

  protected sortStrategyChanged() {
    const sortStrategy = this.form.get('strategy').value;
    this.sortStrategyChange.emit(sortStrategy);
  }
}
