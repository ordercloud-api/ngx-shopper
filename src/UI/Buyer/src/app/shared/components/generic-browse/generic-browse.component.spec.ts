import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GenericBrowseComponent } from './generic-browse.component';

describe('GenericBrowseComponent', () => {
  let component: GenericBrowseComponent;
  let fixture: ComponentFixture<GenericBrowseComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GenericBrowseComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GenericBrowseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
