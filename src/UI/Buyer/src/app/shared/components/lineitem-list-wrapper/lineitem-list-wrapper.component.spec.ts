import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { InjectionToken, NO_ERRORS_SCHEMA } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClient, HttpHandler } from '@angular/common/http';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CookieModule } from 'ngx-cookie';
import {
  OcSupplierService,
  OcLineItemService,
  OcTokenService,
  OcOrderService,
} from '@ordercloud/angular-sdk';

import { AppLineItemService, AppStateService } from '@app-buyer/shared';
import {
  applicationConfiguration,
  AppConfig,
} from '@app-buyer/config/app.config';
import { LineItemListWrapperComponent } from '@app-buyer/shared/components/lineitem-list-wrapper/lineitem-list-wrapper.component';

describe('LineItemSummaryComponent', () => {
  let component: LineItemListWrapperComponent;
  let fixture: ComponentFixture<LineItemListWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LineItemListWrapperComponent],
      imports: [
        RouterTestingModule,
        FontAwesomeModule,
        ReactiveFormsModule,
        CookieModule.forRoot(),
      ],
      providers: [
        AppLineItemService,
        OcSupplierService,
        AppStateService,
        OcLineItemService,
        HttpClient,
        HttpHandler,
        OcTokenService,
        OcOrderService,
        {
          provide: applicationConfiguration,
          useValue: new InjectionToken<AppConfig>('app.config'),
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LineItemListWrapperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    it('should create', () => {
      expect(component).toBeTruthy();
    });
  });
});
