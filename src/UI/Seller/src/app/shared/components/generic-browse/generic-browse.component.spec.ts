import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { GenericBrowseComponent } from '@app-seller/shared/components/generic-browse/generic-browse.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('GenericBrowseComponent', () => {
  let component: GenericBrowseComponent<any>;
  let fixture: ComponentFixture<GenericBrowseComponent<any>>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GenericBrowseComponent],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
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
