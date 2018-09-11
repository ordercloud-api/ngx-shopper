import {
  Component,
  OnInit,
  Input,
  Output,
  OnDestroy,
  EventEmitter,
} from '@angular/core';
import { ListFacet } from '@ordercloud/angular-sdk';
import { ActivatedRoute, Params } from '@angular/router';
import { keys as _keys, intersection as _intersection } from 'lodash';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'product-facet-filter',
  templateUrl: './facet-filter.component.html',
  styleUrls: ['./facet-filter.component.scss'],
})
export class FacetFilterComponent implements OnInit, OnDestroy {
  @Input() facetList: ListFacet[];
  @Output() facetListSelected = new EventEmitter<Params>();
  activeFacets: string[] = [];
  queryParams;
  alive = true;

  constructor(private activatedRoute: ActivatedRoute) {}

  ngOnInit() {
    this.onQueryParamChange();
  }

  private onQueryParamChange() {
    this.activatedRoute.queryParams
      .pipe(takeWhile(() => this.alive))
      .subscribe((queryParams) => {
        this.queryParams = queryParams;
        this.activeFacets = this.findActiveFacets(queryParams);
      });
  }

  private findActiveFacets(queryParams: Params): string[] {
    // find names of facets that are being used to filter products
    const facetNames = this.facetList.map((f) => f.Name);
    const queryParamNames = _keys(queryParams);
    return _intersection(queryParamNames, facetNames);
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
