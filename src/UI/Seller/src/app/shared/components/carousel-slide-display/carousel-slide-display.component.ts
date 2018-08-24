import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {
  CarouselSlide,
  CarouselSlideUpdate,
} from '@app-seller/shared/components/carousel-slide-display/carousel-slide.interface';
import { FormBuilder, FormGroup } from '@angular/forms';
import {
  faSave,
  faTrashAlt,
  faUpload,
} from '@fortawesome/free-solid-svg-icons';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'shared-carousel-slide-display',
  templateUrl: './carousel-slide-display.component.html',
  styleUrls: ['./carousel-slide-display.component.scss'],
})
export class CarouselSlideDisplayComponent implements OnInit {
  @Input() slide: CarouselSlide;
  @Output() save = new EventEmitter<CarouselSlideUpdate>();
  @Output() delete = new EventEmitter<CarouselSlideUpdate>();
  carouselForm: FormGroup;
  faSave = faSave;
  faTrash = faTrashAlt;
  faUpload = faUpload;

  constructor(
    private formBuilder: FormBuilder,
    private toastrService: ToastrService
  ) {}

  ngOnInit() {
    this.carouselForm = this.formBuilder.group({
      URL: this.slide.URL || '',
      headerText: this.slide.headerText || '',
      bodyText: this.slide.bodyText || '',
    });
  }

  fileChange(event) {
    const fileList: FileList = event.target.files;
    if (fileList.length > 0) {
      const file: File = fileList[0];
      // Make API call to image storage integration. API should return the url at which the file is stored.
      // Then, use commented out code below to save this URL in OrderCloud. Delete the toastr.

      // const url = 'http://example.com';
      // this.carouselForm.setValue({ URL: url});
      // this.textChanges();

      const message =
        'File upload functionality requires an integration with file storage. Developers can find details at https://github.com/ordercloud-api/ngx-shopper/blob/development/src/UI/Seller/src/app/shared/components/carousel-slide-display/carousel-slide-display.component.ts';
      this.toastrService.warning(message, null, {
        disableTimeOut: true,
        closeButton: true,
        tapToDismiss: false,
      });
    }
  }

  textChanges(): void {
    if (this.formUnchanged()) return;
    this.save.emit({ prev: this.slide, new: this.carouselForm.value });
  }

  deleteSlide(): void {
    this.delete.emit({ prev: this.slide });
  }

  formUnchanged(): boolean {
    return (
      this.slide.headerText === this.carouselForm.value.headerText &&
      this.slide.bodyText === this.carouselForm.value.bodyText
    );
  }
}
