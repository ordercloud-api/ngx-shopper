import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StatusIconComponent } from '@app-buyer/order/components/status-icon/status-icon.component';
import { FaIconComponent } from '@fortawesome/angular-fontawesome';

describe('StatusIconComponent', () => {
  let component: StatusIconComponent;
  let fixture: ComponentFixture<StatusIconComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [StatusIconComponent, FaIconComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StatusIconComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
