import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { OcBuyerService, Buyer } from '@ordercloud/angular-sdk';
import {
  applicationConfiguration,
  AppConfig,
} from '@app-seller/config/app.config';
import { faSave, faUpload } from '@fortawesome/free-solid-svg-icons';
import { CarouselSlide, CarouselSlideUpdate } from '@app-seller/shared';
import { ToastrService } from 'ngx-toastr';
import { get as _get, set as _set, has as _has } from 'lodash';

@Component({
  selector: 'layout-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  announcementForm: FormGroup;
  buyer: Buyer;
  faUpload = faUpload;
  faSave = faSave;

  constructor(
    private formBuilder: FormBuilder,
    private ocBuyerService: OcBuyerService,
    private toastrService: ToastrService,
    @Inject(applicationConfiguration) private appConfig: AppConfig
  ) {}

  ngOnInit() {
    this.ocBuyerService.Get(this.appConfig.buyerID).subscribe((x) => {
      this.buyer = x;
      this.announcementForm = this.formBuilder.group({
        announcement: _get(this.buyer, 'xp.Announcement', ''),
      });
    });
  }

  saveAnnouncement() {
    const partialBuyer = {
      xp: { Announcement: this.announcementForm.value.announcement },
    };
    this.ocBuyerService
      .Patch(this.appConfig.buyerID, partialBuyer)
      .subscribe((x) => {
        this.buyer = x;
      });
  }

  saveCarousel() {
    const partialBuyer = {
      xp: { carouselSlides: this.buyer.xp.carouselSlides },
    };
    this.ocBuyerService
      .Patch(this.appConfig.buyerID, partialBuyer)
      .subscribe((x) => {
        this.buyer = x;
      });
  }

  deleteSlide(changes: CarouselSlideUpdate) {
    const i = this.buyer.xp.carouselSlides.indexOf(changes.prev);
    this.buyer.xp.carouselSlides.splice(i, 1);
    this.saveCarousel();
  }

  updateSlide(changes: CarouselSlideUpdate) {
    const i = this.buyer.xp.carouselSlides.indexOf(changes.prev);
    this.buyer.xp.carouselSlides[i] = changes.new;
    this.saveCarousel();
  }

  addSlide(slide: CarouselSlide) {
    if (_has(this.buyer, 'xp.carouselSlides')) {
      this.buyer.xp.carouselSlides.push(slide);
    } else {
      _set(this.buyer, 'xp.carouselSlides', [slide]);
    }
    this.saveCarousel();
  }

  announcementUnchanged(): boolean {
    return (
      this.announcementForm &&
      this.announcementForm.value.announcement ===
        _get(this.buyer, 'xp.Announcement', '')
    );
  }

  fileChange(event) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      // Make API call to image storage integration. API should return the url at which the file is stored.
      // Then, use commented out code below to save this URL in OrderCloud. Delete the toastr.

      // const url = 'http://example.com'
      // this.addSlide({ URL: url, headerText: '', bodyText: ''});
      const message =
        'File upload functionality requires an integration with file storage. Developers can find details at https://github.com/ordercloud-api/ngx-shopper/blob/development/src/UI/Seller/src/app/layout/home/home.component.ts';
      this.toastrService.warning(message, null, {
        disableTimeOut: true,
        tapToDismiss: false,
        closeButton: true,
      });
    }
  }
}
