import { Component, Input, EventEmitter, Output, ContentChild, TemplateRef } from '@angular/core';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'shared-template-dropdown',
  // Query for the template being provided by the calling context.
  queries: {
    itemTemplate: new ContentChild(TemplateRef)
  },
  templateUrl: './template-dropdown.component.html',
  styleUrls: ['./template-dropdown.component.scss']
})
export class TemplateDropdownComponent {
  faCaretDown = faCaretDown;

  public isShowingItems = false;
  @Input() public items: any[];
  @Input() placeholder: string;
  @Input() public value: any;
  @Output() public valueChange = new EventEmitter<any>();

  public hideItems(): void {
    this.isShowingItems = false;
  }

  public showItems(): void {
    this.isShowingItems = true;
  }

  public selectItem(item: any): void {
    this.hideItems();
    this.valueChange.emit(item);
  }

  public toggleItems(): void {
    this.isShowingItems ? this.hideItems() : this.showItems();
  }

}
