import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ProductSortStrategy } from '@app-buyer/product/models/product-sort-strategy.enum';
import { each as _each } from 'lodash';

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

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.options = this.getOptions();
    this.setForm();
  }

  private getOptions(): { label: string; value: string }[] {
    let options = [];
    _each(ProductSortStrategy, (strategyVal, strategyName) => {
      options = [...options, { label: strategyName, value: strategyVal }];
    });
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
