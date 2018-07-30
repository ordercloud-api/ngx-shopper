import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'checkout-section-base',
  templateUrl: './checkout-section-base.component.html',
  styleUrls: ['./checkout-section-base.component.scss'],
})
export class CheckoutSectionBaseComponent implements OnInit {
  @Output() continue = new EventEmitter();

  constructor() {}

  ngOnInit() {}

  makeValid() {
    this.continue.emit();
  }
}
