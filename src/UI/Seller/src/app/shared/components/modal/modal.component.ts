import { Component, ElementRef, Input, OnInit, OnDestroy } from '@angular/core';
import { ModalService } from '@app-seller/shared/services/modal/modal.service';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

/**
 * To use this ModalComponent add the following html to your template.
 *
 *  <shared-modal id="myId" modalTitle="My Modal">
 *    <p>Hello World</p>
 *  </shared-modal>
 *
 * Then open the modal with the following Javascript in the controller.
 *
 *  ModalService.open('myId')
 */

@Component({
  selector: 'shared-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit, OnDestroy {
  @Input() id: string;
  @Input() modalTitle: string;
  public isOpen = false;

  faTimes = faTimes;

  constructor(
    private modalService: ModalService,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    // ensure id attribute exists
    if (!this.id) {
      throw Error('modal must have an id');
    }

    // move element to bottom of page (just before </body>) so it can be displayed above everything else
    document.body.appendChild(this.elementRef.nativeElement);

    // add self (this modal instance) to the modal service so it's accessible from controllers
    this.modalService.add(this);
  }

  // remove self from modal service when directive is destroyed
  ngOnDestroy(): void {
    this.close();
    this.modalService.remove(this.id);
    this.elementRef.nativeElement.remove();
  }

  // open modal
  open(): void {
    this.isOpen = true;
    this.elementRef.nativeElement.style.display = 'block';
    document.body.classList.add('shared-modal--open');
  }

  // close modal
  close(): void {
    this.modalService.onCloseSubject.next(this.id);
    this.isOpen = false;
    this.elementRef.nativeElement.style.display = 'none';
    document.body.classList.remove('shared-modal--open');
  }
}
