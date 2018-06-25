import { Pipe, PipeTransform } from '@angular/core';

import { pull as _pull } from 'lodash';

@Pipe({
  name: 'navBrands'
})
export class NavBrandsPipe implements PipeTransform {
  transform(brands: string[]): string[] {
    return _pull(brands, '*Other Brand', 'NO BRAND (Brandless Product)');
  }
}
