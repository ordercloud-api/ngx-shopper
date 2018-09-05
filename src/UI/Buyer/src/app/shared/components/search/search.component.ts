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
import { ActivatedRoute } from '@angular/router';

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

  constructor(
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute
  ) {}

  ngOnInit() {
    this.form = this.formBuilder.group({ search: '' });
    this.onFormChanges();
    this.onQueryParamChanges();
  }

  private onFormChanges() {
    this.form.controls['search'].valueChanges
      .pipe(
        debounceTime(500),
        takeWhile(() => this.alive)
      )
      .subscribe(() => {
        this.search();
      });
  }

  private onQueryParamChanges() {
    // clear search bar if products are no longer filtered by search term
    this.activatedRoute.queryParams
      .pipe(filter((queryParams) => typeof queryParams.search === 'undefined'))
      .subscribe(() => {
        this.form.controls['search'].setValue('');
      });
  }

  private search() {
    let searchTerm = this.form.get('search').value;
    if (!searchTerm) {
      // emit as undefined so sdk ignores parameter completely
      searchTerm = undefined;
    }
    this.searched.emit(searchTerm);
  }

  showClear(): boolean {
    return this.form.get('search').value !== '';
  }

  clear(): void {
    this.form.setValue({ search: '' });
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
