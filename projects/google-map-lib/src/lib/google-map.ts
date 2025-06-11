import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, Self, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleMap, MapAdvancedMarker, MapInfoWindow, MapKmlLayer } from '@angular/google-maps';
import { Easing, Tween, Group } from "@tweenjs/tween.js";

import { IGoogleMapMarker } from './models/google-map-marker.model';
import { ICustomLocationBounds } from './models/custom-location-bounds.model';
import { GoogleMapService } from './services/google-map.service';
import { IGeoJSONGeometry } from './models/geoJson-geometry.model';
import { IGeoJSONFeatureCollection } from './models/geoJson-feature-collection.model';
import { IGeoJSONFeature } from './models/geoJson-feature.model';

/**
 * This generic component expecting these node packages to be installed:
 * 1- @angular/google-maps
 * 2- @tweenjs/tween.js
 */

/**
 * This component could be used to:
 * 1- show one marker or multiple markers on the map with default icon or custom provided icon.
 * 2- add markers to the map and listen to position values for each marker.
 * 3- show info window popup on map init or on marker click with title text or custom html content.
 * 4- show tooltip with title text when hover on markers.
 * 5- Control zoom levels, max zoom, min zoom, map size, map gesture, map types, map restrictions, controls size and more..
 * 6- animate marker icon with 'Drop' animation.
 * 7- animate camera movement smoothly using tweenjs library.
 * 8- draw .kml/.kmz files on the map.
 * 9- add custom overlay on the map with desired size.
 * 10- lock the map camera to saudi arabia bounds or any other desired location.
 */

@Component({
  selector: 'ng-google-map',
  templateUrl: './google-map.html',
  styleUrls: ['./google-map.scss'],
  standalone: true,
  imports: [
    CommonModule,
    GoogleMap,
    MapAdvancedMarker,
    MapInfoWindow,
    MapKmlLayer
  ],
  providers: [GoogleMapService]
})
/** Developed With Love ❤️ By Dev.MahmoudFawzy */
export class GoogleMapComponent implements OnInit, OnDestroy {

  /** 🖤 IMPORTANT 🖤
   * There is a difference between degrees, minutes, seconds (DMS) coordinates & decimal degrees (DD).
   * ° : degree
   * ' : minute
   * " : second
   * Decimal Degrees = degrees + (minutes/60) + (seconds/3600)
   * DD = d + (min/60) + (sec/3600)
   * So for example.. Makkah Latitude is 21° 25' 38.57"N and in decimal = 21 + (25/60) + (38.57/3600) = 21.42738056
   * I already got the code ready in our service to convert DMS to DD.. Thanks to gmaclennan ❤️ https://github.com/gmaclennan
   */

  // Borders coordinates for Saudi Arabia
  private _saudiArabiaBorders: google.maps.LatLngBoundsLiteral = { north: 32.957, south: 16.2158, east: 55.4129, west: 34.3348 };
  // Makkah Cords
  private _makkahCoords: google.maps.LatLngLiteral = { lat: 21.422510, lng: 39.826168 };

  @Input() width: string = "750px";

  @Input() height: string = "400px";

  // By Default Makkah Cords (the private field above)
  @Input() center?: google.maps.LatLngLiteral;

  // Read Only locations.
  @Input() markers: IGoogleMapMarker[] = [];

  // Bind a "true" value if you want to use your first marker in markers array as map center.
  @Input() centerOnFirstMarker: boolean = false;

  // Bind a "true" value to lock the map on Saudi Arabia borders.
  @Input() lockMapToSaudiArabia: boolean = false;

  // location bounds where you want your map camera to be locked to.
  @Input() mapRestrictionBounds?: ICustomLocationBounds;

  // Bind a "false" value if you want to set a marker when click anywhere on map.
  @Input() readOnly: boolean = true;

  // Bind a "true" value if you want user to add more than one location on the map. (readOnly must be false in this case).
  @Input() multipleUserMarkers: boolean = false;

  // Bind a "true" value if you want to show the info window (after map init).
  @Input() markerInfoWindowOnInit: boolean = false;

  // Bind a "true" value if you want to show the info window (on marker click).
  @Input() markerInfoWindowOnClick: boolean = false;

  // Bind a "false" value if you want no offset between infowindow and marker location. // Good when you want to hide markers
  @Input() markerInfoWindowOffsetOnInit: boolean = true;

  // Bind a "true" value if you want to hide markers you provided.
  @Input() hideMarkers: boolean = false;

  // Bind a "false" value if you don't want animation for your markers.
  @Input() markerAnimation: boolean = true;

  // Bind a "false" value if you don't want animation for your camera.
  @Input() cameraAnimation: boolean = true;

  // Bind a "false" value if you want zoom levels be bigger.
  @Input() fractionalZoomEnabled: boolean = true;

  // The size of all map controls in pixels. Must be a number type and 40 is the default size google use for it's api.
  @Input() controlSize: number = 32;

  // This for controlling if user can scroll page over the map or not and zooming functionality. It's 'auto' by default
  @Input() gestureHandling: 'cooperative' | 'auto' | 'greedy' | 'none' = 'auto';

  // Recommended Values between 5 and 15 (lower values is closer to sky and higher values closer to the ground).
  @Input() zoom: number = 10;

  // Cannot "Zoom in" once zoom reach this value. (The higher the value the more you can zoom in).
  @Input() maxZoom?: number;

  // Cannot "Zoom out" once zoom reach this value. (The lower the value the more you can zoom out).
  @Input() minZoom?: number;

  // The zoom level where animation gonna start from.
  @Input() cameraAnimationStartingZoom: number = 5; // level 5 by default (a bit closer to the sky).

  // The time it takes for camera animation to move to the desired destination.
  @Input() cameraAnimationTime: number = 15000; // 15 seconds by default

  // The initial map type that show up once the map load. "hybrid" means satellite but with labels on
  @Input() initialMapType: 'satellite' | 'hybrid' | 'roadmap' = 'hybrid';

  // The shape of the cursor.. you can set to a static value like 'crosshair' or a url for image.
  @Input() draggableCursor?: string;

  // markers that added by user click or two way data binding locations.
  @Input() editableMarkers: IGoogleMapMarker[] = [];

  // A geometry object to render on the map in a new feature collection.
  @Input() geometry?: IGeoJSONGeometry;

  // A feature object to render on the map in a new feature collection.
  @Input() feature?: IGeoJSONFeature;

  // A feature collection object to render on the map.
  @Input() featureCollection?: IGeoJSONFeatureCollection;

  // These bounds coordinates changes later to pixels to represent the scale of the image to render.
  @Input() customOverlayBounds?: ICustomLocationBounds;

  // Custom Overlay Image that you want to render on the map.
  @Input() customOverlayImage?: string;

  // a CDN URL to the .kml or .kmz file you want to draw on the map. (you can export that file using google earth)
  @Input() kmlUrl?: string;

  // Listen to this event if you want to get the new marker position.
  @Output() coordsClick = new EventEmitter<google.maps.LatLngLiteral>();

  // Listen to this event if you want to get the feature data from kml popup.
  @Output() kmlClick = new EventEmitter<google.maps.KmlMouseEvent>();

  @ViewChild(MapInfoWindow) infoWindow!: MapInfoWindow;
  @ViewChild(GoogleMap, { static: true }) googleMap!: GoogleMap;

  mapOptions!: google.maps.MapOptions;
  cameraOptions!: google.maps.CameraOptions;
  tween?: Tween<google.maps.CameraOptions> | null;
  animationSetTimeout: any;

  constructor(@Self() private googleMapService: GoogleMapService) { }

  ngOnInit(): void {
    // Check if the user wants to center the map on the first marker in markers array.
    if (this.markers.length > 0 && this.centerOnFirstMarker === true) {
      this.center = this.markers[0].position;
    }

    // camera options obj is important as zoom property here is used as a starting point for camera animation OR a normal initial zoom.
    this.cameraOptions = {
      zoom: this.cameraAnimation ? this.cameraAnimationStartingZoom : this.zoom,
      center: this.center ? this.center : this.kmlUrl ? undefined : this._makkahCoords
    };

    this.mapOptions = {
      ...this.cameraOptions,
      mapId: '8d6d8d6da1ed965e',
      maxZoom: this.maxZoom,
      minZoom: this.minZoom,
      gestureHandling: this.gestureHandling,
      mapTypeId: this.initialMapType,
      draggableCursor: this.draggableCursor,
      controlSize: this.controlSize,
      isFractionalZoomEnabled: this.fractionalZoomEnabled
    };
  }

  onMapReady(map: google.maps.Map): void {
    // Check if user wants to render a custom overlay or not ?
    if (this.customOverlayBounds && this.customOverlayImage)
      this.initCustomOverlay(map, this.customOverlayBounds, this.customOverlayImage);

    // check if user wants to lock the map to saudi arabia.
    let mapResBounds: google.maps.LatLngBoundsLiteral | google.maps.LatLngBounds | null = null;
    if (this.lockMapToSaudiArabia)
      mapResBounds = this._saudiArabiaBorders;

    // check if user wants to lock the map to some other area.
    if (this.mapRestrictionBounds)
      mapResBounds = new google.maps.LatLngBounds(this.mapRestrictionBounds.southWest, this.mapRestrictionBounds.northEast);

    if (this.mapRestrictionBounds || this.lockMapToSaudiArabia)
      this.mapOptions = {
        ...this.mapOptions,
        restriction: mapResBounds ? { latLngBounds: mapResBounds, strictBounds: false } : null
      }

    // check if user wants camera animation or not ?
    if (this.cameraAnimation) {
      if (this.animationSetTimeout)
        clearTimeout(this.animationSetTimeout);
      this.animationSetTimeout = setTimeout(() => {
        this.animateCamera(map);
      }, 200);
    }

    /**
     * Check if there is a .kml or .kmz file layer imported on the map.
     * If so then we won't load info windows here.
     * but we should wait for onKmlLayerReady() to load it if user wants.
     */
    if (!this.kmlUrl)
      this.showMarkersInfoWindows(map);

    if (this.geometry || this.feature || this.featureCollection)
      map.data.addGeoJson(this.featureCollection ?? {
        type: "FeatureCollection",
        features: [this.feature ?? { type: "Feature", geometry: this.geometry }]
      });
  }

  onMapClick(event: google.maps.MapMouseEvent) {
    if (event.latLng != null && !this.readOnly) {
      if (this.multipleUserMarkers) {
        this.editableMarkers.push({ position: event.latLng.toJSON() });
      } else {
        this.editableMarkers = [{ position: event.latLng.toJSON() }];
      }
      this.coordsClick.emit(event.latLng.toJSON());
    }

    if (this.cameraAnimation && this.tween) {
      this.tween.stop();
      this.tween = null;
    }
  }

  onMapDragStart() {
    if (this.cameraAnimation && this.tween) {
      this.tween.stop();
      this.tween = null;
    }
  }

  onKmlLoad() {
    // will see if the user wants to load info windows on init then it loads it.
    this.showMarkersInfoWindows(this.googleMap.googleMap!);
  }

  onKmlClick(e: google.maps.KmlMouseEvent) {
    this.kmlClick.emit(e);
  }

  onMarkerReady(marker: google.maps.marker.AdvancedMarkerElement) {
    // check if user wants to see 'Drop' animation for markers.
    if (this.markerAnimation)
      this.animateMarker(marker);
  }

  onMarkerClick(marker: MapAdvancedMarker, infoWindowContent?: string | Element | Text) {
    // Check if user wants to open info window on click or not ?
    if (this.markerInfoWindowOnClick)
      this.infoWindow.open(marker, false, infoWindowContent ?? marker.advancedMarker.title);
  }

  animateCamera(map: google.maps.Map) {
    this.tween = new Tween(this.cameraOptions) // Create a new tween that modifies 'cameraOptions'.
      .to({ zoom: this.zoom }, this.cameraAnimationTime) // Move to destination in how much time.
      .easing(Easing.Quadratic.Out) // Use an easing function to make the animation smooth.
      .onUpdate(() => {
        map.moveCamera(this.cameraOptions);
      })
      .start(); // Start the tween immediately.

    const group = new Group()
    group.add(this.tween)

    // Setup the animation loop.
    requestAnimationFrame(function loop(time) {
      group.update(time)
      requestAnimationFrame(loop)
    });
  }

  /**
   * To animate the Advanced Marker, we should use CSS animation.
   * as it's no longer an MVC Object unlike the deprecated Markers.
   */
  animateMarker(marker: google.maps.marker.AdvancedMarkerElement) {
    const intersectionObserver = new IntersectionObserver((entries) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          entry.target.classList.add('drop');
          intersectionObserver.unobserve(entry.target);
        }
      }
    });

    const content = marker.content as HTMLElement;
    content.style.opacity = '0';
    content.addEventListener('animationend', (event) => {
      content.classList.remove('drop');
      content.style.opacity = '1';
    });

    // 0.3s delay for easy to see the animation
    // Math.random() just to keep a delay gap between different drops.
    const time = 0.3 + Math.random();
    content.style.setProperty('--delay-time', time + 's');
    intersectionObserver.observe(content);
  }

  showMarkersInfoWindows(map: google.maps.Map) {
    // Check if user wants to open info window on map init or not ?
    if (this.markerInfoWindowOnInit && this.markers.length > 0) {
      this.markers.forEach((marker: IGoogleMapMarker, index: number) => {
        let infoWindow = new google.maps.InfoWindow();
        infoWindow.setOptions({
          position: marker.position,
          content: marker.infoWindowContent ?? marker.title,
          pixelOffset: this.markerInfoWindowOffsetOnInit ? new google.maps.Size(0, -39) : null
        });
        infoWindow.open(map);
      });
    }
  }

  initCustomOverlay = (map: google.maps.Map, latLngBounds: ICustomLocationBounds, image: string): void => {
    /**
     * A customized Overlay on the map.
     */

    const bounds = new google.maps.LatLngBounds(latLngBounds.southWest, latLngBounds.northEast);

    class CustomOverlay extends google.maps.OverlayView {

      private bounds: google.maps.LatLngBounds;
      private image: string;
      private div?: HTMLElement;

      constructor(bounds: google.maps.LatLngBounds, image: string) {
        super();

        this.bounds = bounds;
        this.image = image;
      }

      /**
       * onAdd is called when the map's panes are ready and the overlay has been
       * added to the map.
       */
      override onAdd() {
        this.div = document.createElement("div");
        this.div.style.borderStyle = "none";
        this.div.style.borderWidth = "0px";
        this.div.style.position = "absolute";

        // Create the img element and attach it to the div.
        const img = document.createElement("img");

        img.src = this.image;
        img.style.width = "100%";
        img.style.height = "100%";
        img.style.position = "absolute";
        this.div.appendChild(img);

        // Add the element to the "overlayLayer" pane.
        const panes = this.getPanes()!;

        panes.overlayLayer.appendChild(this.div);
      }

      override draw() {
        // We use the south-west and north-east
        // coordinates of the overlay to peg it to the correct position and size.
        // To do this, we need to retrieve the projection from the overlay.
        const overlayProjection = this.getProjection();

        // Retrieve the south-west and north-east coordinates of this overlay
        // in LatLngs and convert them to pixel coordinates.
        // We'll use these coordinates to resize the div.
        const sw = overlayProjection.fromLatLngToDivPixel(
          this.bounds.getSouthWest()
        )!;
        const ne = overlayProjection.fromLatLngToDivPixel(
          this.bounds.getNorthEast()
        )!;

        // Resize the image's div to fit the indicated dimensions.
        if (this.div) {
          this.div.style.left = sw.x + "px";
          this.div.style.top = ne.y + "px";
          this.div.style.width = ne.x - sw.x + "px";
          this.div.style.height = sw.y - ne.y + "px";
        }
      }

      /**
       * The onRemove() method will be called automatically from the API if
       * we ever set the overlay's map property to 'null'.
       */
      override onRemove() {
        if (this.div) {
          (this.div.parentNode as HTMLElement).removeChild(this.div);
          delete this.div;
        }
      }

      toggle(map: google.maps.Map) {
        if (this.getMap()) {
          this.setMap(null);
        } else {
          this.setMap(map);
        }
      }
    }

    const overlay: CustomOverlay = new CustomOverlay(bounds, image);
    overlay.setMap(map);

    const toggleButton = document.createElement("button");

    toggleButton.textContent = "Toggle";
    toggleButton.classList.add("custom-map-control-button");

    toggleButton.addEventListener("click", () => {
      overlay.toggle(map);
    });

    map.controls[google.maps.ControlPosition.TOP_CENTER].push(toggleButton);
  }

  identify(index: any, item: any) {
    return item;
  }

  ngOnDestroy(): void {
    if (this.animationSetTimeout)
      clearTimeout(this.animationSetTimeout);
  }
}
