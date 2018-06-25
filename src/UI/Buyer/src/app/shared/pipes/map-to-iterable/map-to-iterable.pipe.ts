import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'mapToIterable',
  pure: false
})
export class MapToIterablePipe implements PipeTransform {

  transform(value: any): any {
    if (value === null || value === undefined) { return null; }
    return Object.keys(value).map(key => value[key]);
  }

}
