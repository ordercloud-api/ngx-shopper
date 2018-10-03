import {
  Component,
  OnInit,
  OnDestroy,
  Output,
  EventEmitter,
} from '@angular/core';
import { faCalendar, faTimes } from '@fortawesome/free-solid-svg-icons';
import { FormGroup, FormBuilder } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { debounceTime, takeWhile } from 'rxjs/operators';
import { AppFormErrorService } from '@app-buyer/shared';
import { DateValidator } from '@app-buyer/shared/validators/date-input/date-input.validator';

@Component({
  selector: 'order-date-filter',
  templateUrl: './date-filter.component.html',
  styleUrls: ['./date-filter.component.scss'],
})
export class DateFilterComponent implements OnInit, OnDestroy {
  private alive = true;
  faCalendar = faCalendar;
  faTimes = faTimes;
  form: FormGroup;
  @Output() selectedDate = new EventEmitter<string[]>();

  constructor(
    private formBuilder: FormBuilder,
    private datePipe: DatePipe,
    private formErrorService: AppFormErrorService
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({
      fromDate: [<Date>null, DateValidator()],
      toDate: [<Date>null, DateValidator()],
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
    const dateSubmitted: string[] = [];

    if (fromDate) {
      dateSubmitted.push(`>${format(fromDate)}`);
    }
    if (toDate) {
      // Add one day so the filter will be inclusive of the date selected
      toDate.setDate(toDate.getDate() + 1);
      dateSubmitted.push(`<${format(toDate)}`);
    }

    this.selectedDate.emit(dateSubmitted);
  }

  clearToDate() {
    this.form.patchValue({ toDate: null });
    this.emitDate();
  }

  clearFromDate() {
    this.form.patchValue({ fromDate: null });
    this.emitDate();
  }

  ngOnDestroy() {
    this.alive = false;
  }

  protected hasDateError = (controlName: string) =>
    this.formErrorService.hasDateError(controlName, this.form);
}
