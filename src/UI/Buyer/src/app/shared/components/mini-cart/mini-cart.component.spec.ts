import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MiniCartComponent } from './mini-cart.component';
import { AppStateService } from '@app-buyer/shared/services/app-state/app-state.service';
import { RouterTestingModule } from '@angular/router/testing';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { CartService } from '@app-buyer/shared/services/cart/cart.service';
import { of } from 'rxjs';

describe('MiniCartComponent', () => {
  let component: MiniCartComponent;
  let fixture: ComponentFixture<MiniCartComponent>;

  const appStateService = {
    lineItemSubject: {
      value: {
        Items: [
          {
            Quantity: 10,
            UnitPrice: 10,
            Product: {
              name: 'test',
              ID: 'test',
            },
          },
        ],
      },
    },
    orderSubject: {
      value: {
        Subtotal: 100,
      },
    },
  };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MiniCartComponent],
      imports: [RouterTestingModule, FontAwesomeModule],
      providers: [
        { provide: AppStateService, useValue: appStateService },
        {
          provide: CartService,
          useValue: {
            buildSpecList: jasmine
              .createSpy('buildSpecList')
              .and.returnValue(of(null)),
          },
        },
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MiniCartComponent);
    component = fixture.componentInstance;
    component.popover = { isOpen: () => {}, close: () => {} } as any;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should set the values of order and lineItems based on the the appState', () => {
      component.ngOnInit();
      expect(component.order).toEqual(appStateService.orderSubject.value);
      expect(component.lineItems).toEqual(
        appStateService.lineItemSubject.value
      );
    });
  });
  describe('close', () => {
    beforeEach(() => {
      spyOn(component.popover, 'isOpen').and.returnValue(true);
      spyOn(component.popover, 'close');
    });
    it('should close the input popover', () => {
      component.close();
      expect(component.popover.close).toHaveBeenCalled();
    });
  });
});
