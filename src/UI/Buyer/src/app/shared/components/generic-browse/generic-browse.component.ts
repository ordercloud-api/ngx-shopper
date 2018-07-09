import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Meta } from '@ordercloud/angular-sdk';

@Component({
  selector: 'shared-generic-browse',
  templateUrl: './generic-browse.component.html',
  styleUrls: ['./generic-browse.component.scss']
})
export class GenericBrowseComponent {

  /**
   *  Nearly every endpoint in the OrderCloud API can be passed a common set of options.
   *  This includes things like search, filter, orderBy, & page. The idea behind this GenericBrowseComponent
   *  is to package the UI elements assosiated with those actions in a single place.
   *
   *  This first draft includes functionality for searching and paginating a list of objects, for example, addresses.
   */

  constructor() { }

  @Input() meta: Meta;
  @Input() searchPlaceholder: string;
  @Output() requestOptionsUpdated = new EventEmitter<{ page?: number, search?: string }>();

}
