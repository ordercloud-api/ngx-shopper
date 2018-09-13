import { Directive, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';
import { fromEvent } from 'rxjs';
import { takeWhile } from 'rxjs/operators';

@Directive({
  selector: 'img[appFallbackImage]',
})
export class FallbackImageDirective implements OnInit, OnDestroy {
  private alive = true;
  private hasUpdatedImg = false;

  // accepts image url to replace failed one with
  // if none is provided will use globalFallbackImage
  @Input('appFallbackImage') appFallbackImage;
  globalFallbackImage = 'http://placehold.it/300x300';

  constructor(private elementRef: ElementRef) {}

  ngOnInit() {
    // listen to error event on element
    fromEvent(this.elementRef.nativeElement, 'error')
      .pipe(
        // only subscribe to event while directive
        // is alive to prevent memory leak
        takeWhile(() => this.alive)
      )
      .subscribe(() => {
        // prevent potential infinite loop in case
        // fallback image errors as well
        if (!this.hasUpdatedImg) {
          this.hasUpdatedImg = true;
          this.updateImageUrl();
        }
      });
  }

  private updateImageUrl() {
    this.elementRef.nativeElement.src =
      this.appFallbackImage || this.globalFallbackImage;
  }

  ngOnDestroy() {
    this.alive = false;
  }
}
