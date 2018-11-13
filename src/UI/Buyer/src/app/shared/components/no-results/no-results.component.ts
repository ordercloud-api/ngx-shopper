import { Component, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'shared-no-results',
  templateUrl: './no-results.component.html',
  styleUrls: ['./no-results.component.scss'],
})
export class NoResultsComponent {
  @Input() message: string;
  @Input() actionText: string;
  @Output() action = new EventEmitter<void>();

  clear() {
    this.action.emit();
  }
}
