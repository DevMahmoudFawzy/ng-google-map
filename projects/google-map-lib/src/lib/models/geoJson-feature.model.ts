import { IGeoJSONGeometry } from "./geoJson-geometry.model";

export interface IGeoJSONFeature {
    id?: any,
    type: 'Feature',
    geometry: IGeoJSONGeometry,
    properties?: any
}