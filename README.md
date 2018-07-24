# ngx-shopper
Four51's starter application for building Angular 6 solutions on the [OrderCloud.io](https://developer.ordercloud.io/documentation) platform.

### Building the Buyer App Locally 

1. Navigate to the UI Directory with `cd src/UI`

2. If you have not before, install the [Angular CLI](https://github.com/angular/angular-cli/wiki) globally on your machine with `npm install -g @angular/cli` 

3. Install dependencies with `npm install`

4. Enter your buyer organization's `clientID` in [environment.ts](src/UI/Buyer/src/environments/environment.ts) (src/UI/Buyer/src/environments/environment.ts)

5. Navigate to `src/UI/Buyer`, the root directory of the buyer app. 

5. Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Building the Seller (Admin) App

1. Navigate to the UI Directory with `cd src/UI`

2. If you have not before, install the [Angular CLI](https://github.com/angular/angular-cli/wiki) globally on your machine with `npm install -g @angular/cli` 

3. Install dependencies with `npm install`

4. Enter your seller organization's `clientID` in [environment.ts](src/UI/Seller/src/environments/environment.ts) (src/UI/Seller/src/environments/environment.ts)

5. Navigate to `src/UI/Seller`, the root directory of the seller app. 

5. Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Other Useful Commands  

*  Run `ng test --sourceMap="false"` from the root of the buyer or seller app to run unit tests.

* Run `ng build` from the root of the buyer or seller app to compile the project without serving.

* Run `ng generate component component-name` from any directory to generate code scafolding for a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

Be sure to check out the [Angular CLI docs](https://github.com/angular/angular-cli) for a full list of commands

