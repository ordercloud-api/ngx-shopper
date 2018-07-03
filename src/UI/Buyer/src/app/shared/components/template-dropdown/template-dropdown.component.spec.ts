import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateDropdownComponent } from './template-dropdown.component';

describe('TemplateDropdownComponent', () => {
  let component: TemplateDropdownComponent;
  let fixture: ComponentFixture<TemplateDropdownComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TemplateDropdownComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TemplateDropdownComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
