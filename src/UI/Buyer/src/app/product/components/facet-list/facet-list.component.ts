import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, FormControl } from '@angular/forms';
import { ListFacet } from '@ordercloud/angular-sdk';
import { ActivatedRoute, Params } from '@angular/router';
import { each as _each } from 'lodash';
import { faPlusSquare, faMinusSquare } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'product-facet-list',
  templateUrl: './facet-list.component.html',
  styleUrls: ['./facet-list.component.scss'],
})
export class FacetListComponent implements OnInit {
  @Input() facet: ListFacet;
  @Output() selectedFacet = new EventEmitter<Params>();
  form: FormGroup;
  visibleFacetLength = 5;
  isCollapsed = false;
  queryParams;
  faPlusSquare = faPlusSquare;
  faMinusSquare = faMinusSquare;

  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.setForm();
  }

  private setForm() {
    this.makeBlankForm();
    this.setValuesOnForm();
  }

  private makeBlankForm() {
    // initialize a blank form with all values set to false
    this.form = this.formBuilder.group({
      facetValues: this.formBuilder.array([]),
    });
    for (let index = 0; index < this.facet.Values.length; index++) {
      (<FormArray>this.form.get('facetValues')).push(new FormControl(false));
    }
  }

  private setValuesOnForm() {
    // populate checkbox if the relevant facet is in query params
    this.activatedRoute.queryParams.subscribe((queryParams) => {
      this.queryParams = queryParams;
      _each(queryParams, (queryParamVal, queryParamName) => {
        if (queryParamName === this.facet.Name) {
          this.facet.Values.forEach((facet, index) => {
            const facetValuesInQueryparams = queryParamVal.split('|');
            if (facetValuesInQueryparams.includes(facet.Value)) {
              (<FormArray>this.form.get('facetValues'))
                .at(index)
                .setValue(true);
            }
          });
        }
      });
    });
  }

  toggleFacets() {
    this.isCollapsed = !this.isCollapsed;
    if (this.isCollapsed) {
      this.visibleFacetLength = 5;
    }
  }

  showMore() {
    this.visibleFacetLength = this.facet.Values.length;
  }

  selectFacet(facetName: string, facetValue: string, index: number) {
    // get selected value
    const facetCheckbox = (<FormArray>this.form.get('facetValues')).at(index);
    const isSelected = !facetCheckbox.value;

    // build up query parameters to emit
    const queryParams = { ...this.queryParams };
    const facetQueryParams = {};
    const facetFilterExists = !!queryParams[facetName];

    if (facetFilterExists) {
      if (isSelected) {
        // different values of the same facet are OR'd together (by convention)
        facetQueryParams[facetName] = `${queryParams[facetName]}|${facetValue}`;
      } else {
        const facetValues = queryParams[facetName].split('|');
        if (facetValues.length > 1) {
          // remove the relevant facet from filter
          facetQueryParams[facetName] = facetValues
            .filter((fV) => fV !== facetValue)
            .join('|');
        } else {
          // setting to undefined so sdk ignores parameter
          facetQueryParams[facetName] = undefined;
        }
      }
    } else {
      // facet filter did not exist previously
      if (isSelected) {
        // set facet value
        facetQueryParams[facetName] = facetValue;
      }
    }

    this.selectedFacet.emit(facetQueryParams);
  }
}
