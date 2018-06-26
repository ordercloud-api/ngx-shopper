import { Component, OnInit } from '@angular/core';
import { NgbCarouselConfig } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private config: NgbCarouselConfig) { }

  ngOnInit() {
    this.config.interval = 5000;
    this.config.wrap = true;
  }
}
