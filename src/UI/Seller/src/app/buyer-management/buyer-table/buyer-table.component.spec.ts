import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuyerTableComponent } from '@app-seller/buyer-management/buyer-table/buyer-table.component';

describe('BuyerTableComponent', () => {
  let component: BuyerTableComponent;
  let fixture: ComponentFixture<BuyerTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [BuyerTableComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BuyerTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
