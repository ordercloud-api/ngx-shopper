import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { InjectionToken } from '@angular/core';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClient, HttpHandler } from '@angular/common/http';

import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CookieModule } from 'ngx-cookie';
import { SupplierService, LineItemService, TokenService, Configuration, OrderService, Supplier } from '@ordercloud/angular-sdk';

import { LineItemCardComponent } from '@app/shared/components/line-item-card/line-item-card.component';
import { OcLineItemService, AppStateService, PhoneFormatPipe } from '@app/shared';
import { applicationConfiguration, AppConfig } from '@app/config/app.config';
import { LineItemListWrapperComponent } from '@app/shared/components/lineitem-list-wrapper/lineitem-list-wrapper.component';


describe('LineItemSummaryComponent', () => {
  let component: LineItemListWrapperComponent;
  let fixture: ComponentFixture<LineItemListWrapperComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        LineItemListWrapperComponent,
        LineItemCardComponent,
        PhoneFormatPipe
      ],
      imports: [
        RouterTestingModule,
        FontAwesomeModule,
        ReactiveFormsModule,
        CookieModule.forRoot()
      ],
      providers: [
        OcLineItemService,
        SupplierService,
        AppStateService,
        LineItemService,
        HttpClient,
        HttpHandler,
        TokenService,
        OrderService,
        { provide: applicationConfiguration, useValue: new InjectionToken<AppConfig>('app.config') }
      ]
    })
      .compileComponents();
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
