import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TemplateDropdownComponent } from './template-dropdown.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

describe('TemplateDropdownComponent', () => {
  let component: TemplateDropdownComponent<any>;
  let fixture: ComponentFixture<TemplateDropdownComponent<any>>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        TemplateDropdownComponent
      ],
      imports: [
        FontAwesomeModule
      ]
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

  describe('hideItems', () => {
    it('should hide the items list', () => {
      component.hideItems();
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('.dropdown__list');
      expect(el).toBeFalsy();
    });
  });

  describe('showItems', () => {
    it('should hide the items list', () => {
      component.showItems();
      fixture.detectChanges();
      const el = fixture.nativeElement.querySelector('.dropdown__list');
      expect(el).toBeTruthy();
    });
  });

  describe('selectItem', () => {
    const item = { ID: '12345' };
    beforeEach(() => {
      spyOn(component.valueChange, 'emit');
      component.selectItem(item);
      fixture.detectChanges();
    });
    it('should hide the items list', () => {
      const el = fixture.nativeElement.querySelector('.dropdown__list');
      expect(el).toBeFalsy();
    });
    it('should emit the item value', () => {
      expect(component.valueChange.emit).toHaveBeenCalledWith(item);
    });
  });
});
