import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressDisplayComponent } from '@app/shared/components/address-display/address-display.component';
import { PhoneFormatPipe } from '@app/shared';

describe('AddressDisplayComponent', () => {
  let component: AddressDisplayComponent;
  let fixture: ComponentFixture<AddressDisplayComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        PhoneFormatPipe,
        AddressDisplayComponent
      ]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddressDisplayComponent);
    component = fixture.componentInstance;
    component.address = { FirstName: 'Crhistian' };
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('getFullName', () => {
    it('should return first name if no last name', () => {
      const address = { FirstName: null, LastName: 'Ramirez' };
      const fullName = component['getFullName'](address);
      expect(fullName).toBe('Ramirez');
    });
    it('should return last name if no first name', () => {
      const address = { FirstName: 'Crhistian', LastName: null };
      const fullName = component['getFullName'](address);
      expect(fullName).toBe('Crhistian');
    });
    it('should return first and last name if both exist', () => {
      const address = { FirstName: 'Crhistian', LastName: 'Ramirez' };
      const fullName = component['getFullName'](address);
      expect(fullName).toBe('Crhistian Ramirez');
    });
  });
});
