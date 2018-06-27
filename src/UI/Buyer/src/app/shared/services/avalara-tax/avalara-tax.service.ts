import { Injectable } from '@angular/core';
import * as Avatax from 'avatax';
import { LineItem, Order, Address } from '@ordercloud/angular-sdk';
import { Observable, Observer } from 'rxjs';
import {
  AvTransactionRequest,
  AvRetailAddress,
  AvLineItem,
  AvAddress,
  AvShippingAddress
} from '@app/shared/services/avalara-tax/avalara-models.interface';

const config = {
  appVersion: '2.0',
  environment: '',
};

// TODO - we have to switch over to a Windmark Avalara account at some point.
const creds = {
  accountId: '2000090261',
  licenseKey: '83C5C2FC4564E1B8'
};

const client = new Avatax(config).withSecurity(creds);

const defaultAddress: AvRetailAddress = {
  singleLocation: {
    line1: '605 Highway 169 N, Suite 400',
    city: 'Minneapolis',
    region: 'MN',
    country: 'US',
    postalCode: '55441'
  }
};

@Injectable()
export class AvalaraTaxService {

  constructor() { }

  // TODO - This will all need to be moved to the integration layer eventually
  getTaxEstimate(lineItems: LineItem[], supplierAddresses: Address[], order: Order): Observable<number> {
    return Observable.create((observer: Observer<number>) => {
      client.createTransaction({
        model: <AvTransactionRequest>{
          type: 'SalesOrder',
          date: moment(new Date()).format('YYYY-MM-DD'),
          customerCode: 'Anonymous',
          addresses: defaultAddress,
          lines: lineItems.map(li => this.mapLineItem(li, supplierAddresses, order))
        }
      }).then(result => {
        observer.next(result.totalTax);
        observer.complete();
      });
    });
  }

  private mapLineItem(li: LineItem, supplierAddresses: Address[], order: Order): AvLineItem {
    let address;
    const supplierAddress = supplierAddresses.find(x => li.xp.product.id.split('-')[0] === x.ID);

    if (li.xp.shippingOption === 'Standard Shipping') {
      address = <AvShippingAddress>{
        shipFrom: this.mapAddress(supplierAddress),
        shipTo: this.mapAddress(order.BillingAddress) // Billing address is same as shipping address
      };
    } else {
      address = <AvRetailAddress>{ singleLocation: this.mapAddress(supplierAddress) };
    }

    return {
      number: li.ID,
      quantity: li.Quantity,
      amount: li.xp.product.price,
      taxCode: li.xp.product.taxCode,
      itemCode: li.xp.product.id,
      addresses: address
    };
  }

  private mapAddress(ocAddress: any): AvAddress {
    return {
      line1: ocAddress.Street1,
      city: ocAddress.City,
      region: ocAddress.State,
      country: 'US',
      postalCode: ocAddress.Zip
    };
  }

}
