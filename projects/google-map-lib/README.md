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

#### 📦 Peer Dependencies

This library has the following peer dependencies, which must be installed in your project:

- `@angular/google-maps: ">=16.0.0 <21.0.0"` *(Depending on your Angular Version)*
- `@tweenjs/tween.js: "^18.6.4"` *(Most stable & recommended version)*

> Note: If you're using **npm v7 or later**, peer dependencies may be automatically installed — but only if they don’t conflict with other dependencies in your project. Otherwise, you’ll need to install them manually.
>- **npm v6 and earlier**: Peer dependencies were **not installed automatically**. Users had to install them manually.
> - **npm v7 and later**: npm **tries** to automatically install peer dependencies. However:
>   - If there's a **version conflict**, npm will **fail the installation** and require manual resolution.
>   - If there are **no conflicts**, npm will install them automatically and will not appear in your project's package.json — unless you install them manually yourself.

#### Recommended Action
To avoid potential issues, manually install any required peer dependencies with:

```bash
npm install <peer-dependency-name>@<version>
```

Replace `<peer-dependency-name>` and `<version>` with the actual values.

## Usage

#### 🗺️ Google Maps Script Requirement

This library is built on top of [`@angular/google-maps`](https://www.npmjs.com/package/@angular/google-maps), which **requires** the Google Maps JavaScript API to be loaded in your application.

You can choose **either** of the following two options:

#### ✅ Option 1: Modern Modular Script (Recommended) — preferred by Google as of 2023+.

This is the **modern and modular way** to load the Google Maps API. It gives you better control over which libraries are loaded and is the preferred approach by Google for new projects.

```html
<!-- Add this script before the closing </body> tag -->
<script>
  (g => {
    var h, a, k, p = "The Google Maps JavaScript API", c = "google", l = "importLibrary", q = "__ib__", m = document, b = window;
    b = b[c] || (b[c] = {});
    var d = b.maps || (b.maps = {}), r = new Set, e = new URLSearchParams,
      u = () => h || (h = new Promise(async (f, n) => {
        await (a = m.createElement("script"));
        e.set("libraries", [...r] + "");
        for (k in g)
          e.set(k.replace(/[A-Z]/g, t => "_" + t[0].toLowerCase()), g[k]);
        e.set("callback", c + ".maps." + q);
        a.src = `https://maps.${c}apis.com/maps/api/js?` + e;
        d[q] = f;
        a.onerror = () => h = n(Error(p + " could not load."));
        a.nonce = m.querySelector("script[nonce]")?.nonce || "";
        m.head.append(a)
      }));
    d[l] ? console.warn(p + " only loads once. Ignoring:", g) :
      d[l] = (f, ...n) => r.add(f) && u().then(() => d[l](f, ...n))
  })({
    v: "weekly",                    // API version
    key: "YOUR_GOOGLE_API_KEY",    // Replace with your actual API key
    language: "ar",                // Optional: set your preferred language
    region: "SA-02"                // Optional: set your region
  });
</script>
```

#### ✅ Option 2: Classic Script with `defer`

This is the **older but simpler approach**, suitable for basic use cases or legacy projects. It loads the full Google Maps API immediately.

```html
<!-- Add this script inside <head> or before </body> -->
<script
  src="https://maps.googleapis.com/maps/api/js?key=YOUR_GOOGLE_API_KEY"
  defer
></script>
```

> 🔑 Replace `YOUR_GOOGLE_API_KEY` with your actual Google Maps API key.\
> 💡 It’s recommended to place it **before **``, but it can also work if added in `<head>` or at the end of `<body>`. Just ensure it's loaded before your app uses any map features.

Failing to add one of these scripts will result in runtime errors.

---

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

To keep this README lightweight, the full list of component inputs and outputs is available on [GitHub repository](https://github.com/DevMahmoudFawzy/ng-google-map).  
We recommend checking there for the most accurate and updated details.

## License

MIT