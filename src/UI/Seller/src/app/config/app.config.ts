import { InjectionToken } from '@angular/core';
import { environment } from '../../environments/environment';

export const ocAppConfig: AppConfig = {
  appname: 'OrderCloud Admin',
  clientID: environment.clientID,
  middlewareUrl: environment.middlewareUrl,
  buyerID: environment.buyerID,
  buyerClientID: environment.buyerClientID,
  buyerUrl: environment.buyerUrl,
  scope: [
    'MeAddressAdmin',
    'MeAdmin',
    'BuyerUserAdmin',
    'UserGroupAdmin',
    'MeCreditCardAdmin',
    'MeXpAdmin',
    'Shopper',
    'CategoryReader',
    'ProductAdmin',
    'SupplierReader',
    'SupplierAddressReader',
    'BuyerAdmin',
    'OverrideUnitPrice',
    'OrderAdmin',
    'OverrideTax',
    'OverrideShipping',
    'BuyerImpersonation',
    'AddressAdmin',
    'CategoryAdmin',
    'CatalogAdmin',
  ],
};

export const applicationConfiguration = new InjectionToken<AppConfig>(
  'app.config',
  { providedIn: 'root', factory: () => ocAppConfig }
);

export interface AppConfig {
  /**
   * A short name for your app. It will be used as a
   * cookie prefix as well as general display throughout the app.
   */
  appname: string;

  /**
   * The identifier for the seller, buyer network or buyer application that
   * will be used for authentication. You can view client ids for apps
   * you own or are a contributor to on the [dashboard](https://developer.ordercloud.io/dashboard)
   */
  clientID: string;

  /**
   * The identifier of the buyer org. This admin app is designed to manage a single Buyer organization. The OC
   * API supports multiple buyer organizations per seller, but this app is not currently indended for that architecture.
   */
  buyerID: string;

  /**
   * The client ID of the buyer org.
   */
  buyerClientID: string;

  /**
   * base path to buyer site
   */
  buyerUrl: string;

  /**
   * base path to middleware
   */
  middlewareUrl: string;

  /**
   * An array of security roles that will be requested upon login.
   * These roles allow access to specific endpoints in the OrderCloud.io API.
   * To learn more about these roles and the security profiles that comprise them
   * read [here](https://developer.ordercloud.io/documentation/platform-guides/authentication/security-profiles)
   */
  scope: string[];
}
