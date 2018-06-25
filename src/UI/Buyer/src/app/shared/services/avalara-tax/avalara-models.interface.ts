export interface AvTransactionRequest {
    type: string;
    date: string;
    customerCode: string; // user id
    addresses: AvRetailAddress; // default address. Corporate HQ.
    lines: AvLineItem[];
}

export interface AvLineItem {
    number: string; // line item id
    quantity: number;
    amount: number;
    taxCode: string;
    itemCode: string; // product id
    addresses: AvShippingAddress | AvRetailAddress;
}

export interface AvShippingAddress {
    shipFrom: AvAddress;
    shipTo: AvAddress;
}

export interface AvRetailAddress {
    singleLocation: AvAddress;
}

export interface AvAddress {
    line1: string;
    city: string;
    region: string;
    country: string;
    postalCode: string;
}


