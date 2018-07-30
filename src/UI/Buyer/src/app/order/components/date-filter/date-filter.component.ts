import {
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
} from '@angular/core';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { debounceTime, takeWhile } from 'rxjs/operators';

@Component({
  selector: 'order-date-filter',
  templateUrl: './date-filter.component.html',
  styleUrls: ['./date-filter.component.scss'],
})
export class DateFilterComponent implements OnInit, OnDestroy {
  private alive = true;
  faCalendar = faCalendar;
  form: FormGroup;
  @Output() selectedDate = new EventEmitter<string[]>();

  constructor(private formBuilder: FormBuilder, private datePipe: DatePipe) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      fromDate: <Date>null,
      toDate: <Date>null,
    });
    this.onFormChanges();
  }

  private onFormChanges() {
    this.form.valueChanges
      .pipe(
        debounceTime(500),
        takeWhile(() => this.alive)
      )
      .subscribe(() => {
        this.emitDate();
      });
  }

  private emitDate() {
    if (this.form.get('fromDate').invalid || this.form.get('toDate').invalid) {
      return;
    }
    const format = (date) =>
      this.datePipe.transform(date, 'shortDate').replace(/\//g, '-');
    const fromDate = <Date>this.form.get('fromDate').value;
    const toDate = <Date>this.form.get('toDate').value;
    let dateSubmitted: string[];

    if (fromDate && toDate) {
      dateSubmitted = [`>${format(fromDate)}`, `<${format(toDate)}`];
    } else if (fromDate && !toDate) {
      dateSubmitted = [`>${format(fromDate)}`];
    } else if (!fromDate && toDate) {
      dateSubmitted = [`<${format(toDate)}`];
    }
    this.selectedDate.emit(dateSubmitted);
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
