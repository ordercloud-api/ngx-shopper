import { Injectable } from '@angular/core';

@Injectable()
export class ModalService {
  private modals: any[] = [];

  add(modal: any): void {
    // add modal to array of active modals
    this.modals.push(modal);
  }

  remove(id: string): void {
    // remove modal from array of active modals
    this.modals = this.modals.filter((x) => x.id !== id);
  }

  open(id: string): void {
    // open modal specified by id
    setTimeout(() => {
      const modal: any = this.modals.filter((x) => x.id === id)[0];
      modal.open();
    });
  }

  close(id: string): void {
    // close modal specified by id
    setTimeout(() => {
      const modal: any = this.modals.filter((x) => x.id === id)[0];
      modal.close();
    });
  }
}
