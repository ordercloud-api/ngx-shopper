import { Pipe, PipeTransform } from '@angular/core';

/**
 * looping over a map doesn't work natively - https://stackoverflow.com/questions/31490713/iterate-over-object-in-angular
 * this lets us loop over a map and retrieve values from 'value' and keys from 'key'
 */
@Pipe({
  name: 'mapToIterable',
  pure: false,
})
export class MapToIterablePipe implements PipeTransform {
  transform(map: any): any {
    if (map === null || map === undefined) {
      return null;
    }
    return Object.keys(map).map((key) => {
      return {
        key: key,
        value: map[key],
      };
    });
  }
}
