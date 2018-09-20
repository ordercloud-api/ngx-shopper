import {
  Component,
  OnInit,
  OnDestroy,
  Input,
  EventEmitter,
  Output,
} from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { faSearch, faTimes } from '@fortawesome/free-solid-svg-icons';
import { debounceTime, takeWhile, filter } from 'rxjs/operators';

@Component({
  selector: 'shared-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit, OnDestroy {
  alive = true;
  @Input() placeholderText?: string;
  @Output() searched = new EventEmitter<string>();
  faSearch = faSearch;
  faTimes = faTimes;
  form: FormGroup;
  previousSearchTerm = '';

  constructor(private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.form = this.formBuilder.group({ search: '' });
    this.onFormChanges();
  }

  private onFormChanges() {
    this.form.controls['search'].valueChanges
      .pipe(
        filter((searchTerm) => {
          const userTriggered = this.form.dirty;
          return searchTerm !== this.previousSearchTerm && userTriggered;
        }),
        debounceTime(500),
        takeWhile(() => this.alive)
      )
      .subscribe((searchTerm) => {
        this.previousSearchTerm = searchTerm;
        this.search();
      });
  }

  private search() {
    const searchTerm = this.form.controls.search.value;
    this.form.markAsPristine();
    // emit as undefined if empty string so sdk ignores parameter completely
    this.searched.emit(searchTerm || undefined);
  }

  showClear(): boolean {
    return this.form.get('search').value !== '';
  }

  clear(): void {
    this.form.markAsDirty();
    this.form.setValue({ search: '' });
  }

  clearWithoutEmit(): void {
    this.form.setValue({ search: '' });
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
