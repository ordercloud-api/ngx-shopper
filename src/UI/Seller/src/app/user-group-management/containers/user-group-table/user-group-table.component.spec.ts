import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UserGroupTableComponent } from './user-group-table.component';

describe('UserGroupTableComponent', () => {
  let component: UserGroupTableComponent;
  let fixture: ComponentFixture<UserGroupTableComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserGroupTableComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserGroupTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
