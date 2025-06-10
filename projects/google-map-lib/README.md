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
<google-map
  [center]="{ lat: 24.7136, lng: 46.6753 }"
  [zoom]="10"
  [markers]="markerList"
  (markerPositionChanged)="onMarkerMoved($event)">
</google-map>
```

## Inputs & Outputs

| Input | Description |
|-------|-------------|
| `center` | The initial center of the map (LatLng object) |
| `zoom` | Initial zoom level |
| `markers` | List of markers with positions and options |
| `kmlUrl` | URL to a KML/KMZ file |
| `geoJson` | GeoJSON data object |
| `customOverlay` | Object defining custom overlay data |
| `mapRestrictions` | Restrict panning outside certain bounds |

| Output | Description |
|--------|-------------|
| `markerPositionChanged` | Emits when a marker is dragged to a new location |
| `mapReady` | Emits when the map is fully initialized |
| `markerClicked` | Emits when a marker is clicked |

## Dependencies

- `@angular/core`
- `@types/google.maps`
- `tween.js`

Make sure you load the Google Maps JavaScript API in your index.html with a valid API key.

```html
<script src="https://maps.googleapis.com/maps/api/js?key=YOUR_API_KEY"></script>
```

## License

MIT

