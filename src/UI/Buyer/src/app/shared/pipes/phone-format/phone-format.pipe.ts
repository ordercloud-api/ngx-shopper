import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tel',
})
export class PhoneFormatPipe implements PipeTransform {
  transform(tel: string) {
    if (!tel) {
      return '';
    }

    const value = tel
      .toString()
      .trim()
      .replace(/[^0-9]/g, '');

    let city, number;

    switch (value.length) {
      case 1:
      case 2:
      case 3:
        city = value;
        break;

      default:
        city = value.slice(0, 3);
        number = value.slice(3);
    }
    if (number) {
      if (number.length > 3) {
        number = `${number.slice(0, 3)}-${number.slice(3, 7)}`;
      }

      return `(${city}) ${number}`.trim();
    } else {
      return `(${city}`;
    }
  }
}
