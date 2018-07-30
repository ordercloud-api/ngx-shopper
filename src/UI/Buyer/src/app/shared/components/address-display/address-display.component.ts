import { Component, Input, OnInit } from '@angular/core';
import { Address } from '@ordercloud/angular-sdk';

@Component({
  selector: 'shared-address-display',
  templateUrl: './address-display.component.html',
  styleUrls: ['./address-display.component.scss'],
})
export class AddressDisplayComponent implements OnInit {
  @Input() address: Address;
  @Input() addressTitle?: string;

  ngOnInit() {
    this.address['FullName'] = this.getFullName(this.address);
  }

  protected getFullName(address: Address) {
    const fullName = `${address.FirstName || ''} ${address.LastName || ''}`;
    return fullName.trim();
  }
}
