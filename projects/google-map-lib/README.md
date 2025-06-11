# 🗺️ NG Google Map

[![npm version](https://img.shields.io/npm/v/ng-google-map.svg)](https://www.npmjs.com/package/ng-google-map)
[![npm downloads](https://img.shields.io/npm/dm/ng-google-map.svg)](https://www.npmjs.com/package/ng-google-map)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**A powerful, flexible, and easy-to-use Angular standalone component for advanced Google Maps features — animation, data layers, overlays, and full customization.**  

## Features

- 📍 Display one or multiple markers with default or custom icons  
- 💬 Show info windows on marker click or on map init (with text or custom HTML)  
- 🧭 Animated camera transitions using tween.js  
- ✨ Tooltip display on marker hover  
- 🗂️ Cluster markers or manage each marker independently with position change events  
- 🎯 Support for marker drop animation  
- 🧱 KML & KMZ file support, plus GeoJSON rendering  
- 🗟️ Custom overlays with size and content flexibility  
- 🔒 Lock map camera to bounds (e.g., Saudi Arabia or any region)  
- 🔧 Fine-grained map control: zoom levels, gestures, restrictions, map types, control sizing  
- ⚡ High-performance rendering  
- 📦 Fully standalone Angular component

## Installation

```bash
npm install ng-google-map
```

## Usage

Import the component and use it in your standalone or module-based Angular app:

```ts
import { GoogleMapComponent } from 'ng-google-map';
```

```html
<ng-google-map
  [center]="{ lat: 24.7136, lng: 46.6753 }"
  [zoom]="10"
  [markers]="markerList"
  (markerPositionChanged)="onMarkerMoved($event)" />
```

## API

### Inputs & Outputs

| Input | Type | Description |
|-------|------|-------------|
| `height` | string | The height along the y-axis, in pixels. |
| `width` | string | The width along the x-axis, in pixels. |
| `center` | google.maps.LatLngLiteral | Specifies the coordinates where the Google Map should be centered. |
| `markers` | IGoogleMapMarker[] | Read Only locations markers on the map. |
| `centerOnFirstMarker` | boolean | Bind a "true" value if you want to use your first marker in markers array as map center. |

| Output | Description |
|--------|-------------|
| `markerPositionChanged` | Emits when a marker is dragged to a new location |
| `mapReady` | Emits when the map is fully initialized |
| `markerClicked` | Emits when a marker is clicked |

### Defaults
#### `@Input() center?: google.maps.LatLngLiteral`

Specifies the coordinates where the Google Map should be centered.

- **Type:** `google.maps.LatLngLiteral`
- **Optional:** Yes
- **Default:** If not provided, the map will center on **Makkah**. (note that if "**kmlUrl**" provided, the map will be centered on it instead of Makkah)

```ts
Default:
center = { lat: 21.422510, lng: 39.826168 }; // Makkah coordinates
```

## Dependencies

- `@angular/core`
- `@angular/google-maps`
- `@tweenjs/tween.js`

Make sure you load the Google Maps JavaScript API in your index.html with a valid API key.

```html
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY"></script>
```

## License

MIT