import { Component, Input } from '@angular/core';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'products-additional-image-gallery',
  templateUrl: './additional-image-gallery.component.html',
  styleUrls: ['./additional-image-gallery.component.scss']
})

export class AdditionalImageGalleryComponent {
  // gallerySize can be changed and the component logic + behavior will all work. However, the UI may look wonky.
  private readonly gallerySize = 5;

  @Input() imgUrls: string[];
  selectedIndex = 0;
  startIndex = 0;
  endIndex = this.gallerySize - 1;
  faAngleLeft = faAngleLeft;
  faAngleRight = faAngleRight;
  constructor() { }

  select(url: string): void {
    this.selectedIndex = this.imgUrls.indexOf(url);
  }

  isSelected(url: string): boolean {
    return this.imgUrls.indexOf(url) === this.selectedIndex;
  }

  getGallery(): string[] {
    return this.imgUrls.slice(this.startIndex, this.endIndex + 1);
  }

  forward() {
    this.selectedIndex++;
    if (this.selectedIndex > Math.min(this.endIndex, this.imgUrls.length - 1)) {
      // move images over one
      this.startIndex++;
      this.endIndex++;
      if (this.selectedIndex === this.imgUrls.length) {
        // cycle to the beginning
        [this.selectedIndex, this.startIndex, this.endIndex] = [0, 0, this.gallerySize - 1];
      }
    }
  }

  backward() {
    this.selectedIndex--;
    if (this.selectedIndex < this.startIndex) {
      // move images over one
      this.startIndex--;
      this.endIndex--;
      if (this.selectedIndex === -1) {
        // cycle to the end
        this.selectedIndex = this.imgUrls.length - 1;
        this.endIndex = this.imgUrls.length - 1;
        this.startIndex = Math.max(this.imgUrls.length - this.gallerySize, 0);
      }
    }
  }
}
