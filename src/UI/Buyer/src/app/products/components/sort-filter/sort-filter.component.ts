import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ProductSortStrategy } from '@app-buyer/products/models/product-sort-strategy.enum';

@Component({
  selector: 'products-sort-filter',
  templateUrl: './sort-filter.component.html',
  styleUrls: ['./sort-filter.component.scss'],
})
export class SortFilterComponent implements OnInit {
  form: FormGroup;
  options = ProductSortStrategy;
  @Input() sortStrategy?: string;
  @Output() sortStrategyChange = new EventEmitter<ProductSortStrategy>();

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.setForm();
  }

  private setForm() {
    this.form = this.formBuilder.group({
      strategy: this.options[this.sortStrategy],
    });
  }

  protected sortStrategyChanged() {
    const sortStrategy = this.form.get('strategy').value;
    this.sortStrategyChange.emit(sortStrategy);
  }
}
