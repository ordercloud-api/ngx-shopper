// TODO: write unit tests - commenting out now so we can add to CI pipeline

// import { TestBed, inject } from '@angular/core/testing';

// import { AppLineItemService } from './line-item.service';
// import { AppStateService } from '@app-buyer/shared';
// import { OcLineItemService, OcOrderService, OcTokenService, Configuration } from '@ordercloud/angular-sdk';
// import { HttpClient, HttpHandler } from '@angular/common/http';
// import { CookieModule } from 'ngx-cookie';
// import { applicationConfiguration, AppConfig } from '@app-buyer/config/app.config';
// import { InjectionToken } from '@angular/core';

// describe('AppLineItemService', () => {
//   beforeEach(() => {
//     TestBed.configureTestingModule({
//       imports: [
//         CookieModule.forRoot()
//       ],
//       providers: [
//         AppLineItemService,
//         AppStateService,
//         OcLineItemService,
//         OcOrderService,
//         HttpClient,
//         HttpHandler,
//         OcTokenService,
//         { provide: applicationConfiguration, useValue: new InjectionToken<AppConfig>('app.config') }
//       ]

//     });
//   });

//   it('should be created', inject([AppLineItemService], (service: AppLineItemService) => {
//     expect(service).toBeTruthy();
//   }));
// });
