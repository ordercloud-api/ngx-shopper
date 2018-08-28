import {
  Component,
  OnInit,
  Input,
  Output,
  ContentChild,
  TemplateRef,
  EventEmitter,
} from '@angular/core';
import { Meta } from '@ordercloud/angular-sdk';

@Component({
  selector: 'shared-generic-browse',
  templateUrl: './generic-browse.component.html',
  styleUrls: ['./generic-browse.component.scss'],
})
export class GenericBrowseComponent<T> {
  /**
   *  Nearly every endpoint in the OrderCloud API can be passed a common set of options.
   *  This includes things like search, filter, orderBy, & page. The idea behind this GenericBrowseComponent
   *  is to package the UI elements assosiated with those actions in a single place.
   *
   *  This first draft includes functionality for searching and paginating a list of objects, for example, addresses.
   */
  constructor() {}

  // Information about pagination
  @Input() meta: Meta;

  @Input() searchPlaceholder: string;

  @Output() search = new EventEmitter<string>();

  @Output() page = new EventEmitter<number>();
}
