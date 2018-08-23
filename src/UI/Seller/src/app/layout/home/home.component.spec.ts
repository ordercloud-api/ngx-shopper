import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeComponent } from '@app-seller/layout/home/home.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ToastrService } from 'ngx-toastr';
import { FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { OcBuyerService } from '@ordercloud/angular-sdk';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { applicationConfiguration } from '@app-seller/config/app.config';
import { CarouselSlide } from '@app-seller/shared';

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;
  const mockBuyer = {
    xp: {
      Announcement: 'hello',
      carouselSlides: [{ URL: '1' }, { URL: '2' }, { URL: '3' }],
    },
  };
  const ocBuyerService = {
    Get: jasmine.createSpy('Get').and.returnValue(of(mockBuyer)),
    Patch: jasmine.createSpy('Patch').and.returnValue(of(mockBuyer)),
  };
  const toastrService = { warning: jasmine.createSpy('warning') };

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [HomeComponent],
      imports: [FontAwesomeModule, ReactiveFormsModule, FormsModule],
      providers: [
        FormBuilder,
        { provide: ToastrService, useValue: toastrService },
        { provide: OcBuyerService, useValue: ocBuyerService },
        {
          provide: applicationConfiguration,
          useValue: { buyerID: 'buyerID' },
        },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ngOnInit', () => {
    it('should call Get Buyer and set the form', () => {
      component.ngOnInit();
      expect(ocBuyerService.Get).toHaveBeenCalledWith('buyerID');
      expect(component.announcementForm.value.announcement).toEqual(
        mockBuyer.xp.Announcement
      );
    });
  });

  describe('saveAnnouncement', () => {
    it('should call patch Buyer with announcement', () => {
      component.saveAnnouncement();
      expect(ocBuyerService.Patch).toHaveBeenCalledWith('buyerID', {
        xp: { Announcement: mockBuyer.xp.Announcement },
      });
    });
  });

  describe('saveCarousel', () => {
    it('should call patch Buyer with carousel', () => {
      component.saveCarousel();
      expect(ocBuyerService.Patch).toHaveBeenCalledWith('buyerID', {
        xp: { carouselSlides: mockBuyer.xp.carouselSlides },
      });
    });
  });

  describe('addSlide', () => {
    it('should call patch Buyer with new slide', () => {
      ocBuyerService.Patch.calls.reset();
      component.buyer.xp.carouselSlides = [
        { URL: '1' },
        { URL: '2' },
        { URL: '3' },
      ];
      component.addSlide(<CarouselSlide>{ URL: '4' });
      expect(ocBuyerService.Patch).toHaveBeenCalledWith('buyerID', {
        xp: {
          carouselSlides: [
            { URL: '1' },
            { URL: '2' },
            { URL: '3' },
            { URL: '4' },
          ],
        },
      });
    });
  });
});
