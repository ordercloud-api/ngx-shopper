import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SpecFormComponent } from './spec-form.component';

describe('SpecFormComponent', () => {
  let component: SpecFormComponent;
  let fixture: ComponentFixture<SpecFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SpecFormComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SpecFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });
});
