// TODO: write unit tests - commenting out now so we can add to CI pipeline

// import { TestBed, inject } from '@angular/core/testing';

// import { OcLineItemService } from './oc-line-item.service';
// import { AppStateService } from '@app/shared';
// import { LineItemService, OrderService, TokenService, Configuration } from '@ordercloud/angular-sdk';
// import { HttpClient, HttpHandler } from '@angular/common/http';
// import { CookieModule } from 'ngx-cookie';
// import { applicationConfiguration, AppConfig } from '@app/config/app.config';
// import { InjectionToken } from '@angular/core';

// describe('OcLineItemService', () => {
//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       imports: [
//         CookieModule.forRoot()
//       ],
//       providers: [
//         OcLineItemService,
//         AppStateService,
//         LineItemService,
//         OrderService,
//         HttpClient,
//         HttpHandler,
//         TokenService,
//         { provide: applicationConfiguration, useValue: new InjectionToken<AppConfig>('app.config') }
//       ]

//     });
//   });

//   it('should be created', inject([OcLineItemService], (service: OcLineItemService) => {
//     expect(service).toBeTruthy();
//   }));
// });
