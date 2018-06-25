import { Injectable } from '@angular/core';
import { Observer ,  Observable } from 'rxjs';

import { CookieService } from 'ngx-cookie';

/** This service gets the user's location.
  Currently, if user's browser does NOT support geolocation OR the user has blocked location sharing, it fails with an error message.

  example usage

  this.geolocator.saveClientLocation().subscribe(() => {
    console.log(this.geolocator.getClientLocation());
  });

  We could call saveClientLocation() once before the app loads. It will save location data in cookies if it succeeds.
  **/


@Injectable()
export class GeolocatorService {

  constructor(private cookieService: CookieService) { }

  getClientLocation() {
    const coordinates = <any>this.cookieService.getObject('coordinates');

    if (!coordinates) {
      throw Error('No Geolocation Data');
    }

    return coordinates;
   }

  saveClientLocation(): Observable<void> {
    return Observable.create((observer: Observer<void>) => {
      const coordinates = <any>this.cookieService.getObject('coordinates');

      if (coordinates) {
        observer.next(null);
        return observer.complete();
      }

      if (!navigator.geolocation) {
        observer.next(null);
        return observer.error('Geolocation not supported in browser');
      }

      navigator.geolocation.getCurrentPosition(position => {
        this.cookieService.putObject('coordinates', {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        observer.next(null);
        return observer.complete();
      },
      err => {
        // this will throw an error if the user blocks location
        throw err;
      });
    });
  }
}
