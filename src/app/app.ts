import { Component } from '@angular/core';
import { GoogleMapComponent } from 'google-map-lib';

@Component({
  selector: 'app-root',
  imports: [GoogleMapComponent],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected title = 'ng-google-map';
}
