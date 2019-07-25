import {
  Component,
  Input,
  Output,
  EventEmitter,
  ContentChild,
  TemplateRef,
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

  @Input() items: T[];

  // Information about pagination
  @Input() meta: Meta;

  @Input() searchPlaceholder: string;

  // Display option - one or two columns. Default is two.
  @Input() numColumns: 1 | 2 = 2;

  // Event to capture search changes or page changes
  @Output()
  requestOptionsUpdated = new EventEmitter<{
    page?: number;
    search?: string;
  }>();

  // References the html content inside the instance of the element
  @ContentChild(TemplateRef, { static: false }) itemTemplate;
}
