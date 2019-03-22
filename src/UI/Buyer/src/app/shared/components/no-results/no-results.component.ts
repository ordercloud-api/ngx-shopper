import {
  Component,
  Input,
  EventEmitter,
  Output,
  OnDestroy,
} from '@angular/core';
import { Meta } from '@angular/platform-browser';

@Component({
  selector: 'shared-no-results',
  templateUrl: './no-results.component.html',
  styleUrls: ['./no-results.component.scss'],
})
export class NoResultsComponent implements OnDestroy {
  @Input() message: string;
  @Input() actionText: string;
  @Output() action = new EventEmitter<void>();

  constructor(private meta: Meta) {
    this.meta.addTag({ name: 'robots', content: 'noindex' });
  }

  clear() {
    this.action.emit();
  }

  ngOnDestroy() {
    this.meta.removeTag('name="robots"');
  }
}
