import { Component, Input, EventEmitter, Output, ContentChild, TemplateRef } from '@angular/core';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'shared-template-dropdown',
  templateUrl: './template-dropdown.component.html',
  styleUrls: ['./template-dropdown.component.scss']
})
export class TemplateDropdownComponent<T> {
  faCaretDown = faCaretDown;

  public isShowingItems = false;
  @Input() public items: T[];
  @Input() placeholder: string;
  @Input() public value: T;
  @Output() public valueChange = new EventEmitter<T>();
  @ContentChild(TemplateRef) itemTemplate;

  public hideItems(): void {
    this.isShowingItems = false;
  }

  public showItems(): void {
    this.isShowingItems = true;
  }

  public selectItem(item: T): void {
    this.hideItems();
    this.valueChange.emit(item);
  }

  public toggleItems(): void {
    this.isShowingItems ? this.hideItems() : this.showItems();
  }

}
