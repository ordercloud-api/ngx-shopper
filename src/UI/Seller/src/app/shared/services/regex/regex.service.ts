import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
// These regular expressions are all used for form validation
export class RegexService {
  constructor() {}

  // used for all Ordercloud IDs
  get ID() {
    return '^[a-zA-Z0-9_-]*$'; // only alphanumeric and _ -
  }

  // used for ProductName, CategoryName
  get ObjectName() {
    return '^[a-zA-Z0-9-(),:;&*\\s]{0,60}$'; // max 60 chars, alphanumeric, space and - ( ) , : ; & *
  }

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

  // used for Carousel text
  get HundredChar() {
    return '.{0,100}'; // max 100 chars
  }

  get Zip() {
    return '^[0-9]{5}$'; // US zip - five numbers
  }
}
