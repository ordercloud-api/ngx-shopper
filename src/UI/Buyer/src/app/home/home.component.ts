import { Component, OnInit } from '@angular/core';
import { GeolocatorService } from '@app/shared';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  // TODO: This is a placeholder component
  // Find a good spot to include this.  Perhaps a module of it's own or included in a module called Static for static pages like this
  constructor(private geolocator: GeolocatorService) { }

  ngOnInit() {
    this.geolocator.saveClientLocation().subscribe();
  }
}
