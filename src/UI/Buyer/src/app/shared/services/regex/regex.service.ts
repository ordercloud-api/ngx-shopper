import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
// These regular expressions are all used for form validation
export class RegexService {
  constructor() {}

  // used for FirstName, LastName, City
  get HumanName() {
    return "^[a-zA-Z0-9-.'\\s]*$"; // only alphanumic and space . '
  }

  get Email() {
    return '^.+@.+\\..+$'; // contains @ and . with text surrounding
  }

  get Phone() {
    return '^[0-9-]{0,20}$'; // max 20 chars, numbers and -
  }

  get Date() {
    return '^[0-9]{2}-[0-9]{2}-[0-9]{4}$'; // mm-dd-yyyy, all numbers
  }

  getZip(countryCode = 'US') {
    switch (countryCode) {
      case 'CA':
        return '^[A-Za-z]\\d[A-Za-z][ -]?\\d[A-Za-z]\\d$';
      case 'US':
        return '^[0-9]{5}$'; // US zip - five numbers
    }
  }
}
