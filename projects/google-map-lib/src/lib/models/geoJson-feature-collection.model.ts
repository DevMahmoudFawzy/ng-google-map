import { IGeoJSONFeature } from "./geoJson-feature.model";

export interface IGeoJSONFeatureCollection {
    type: 'FeatureCollection',
    features: IGeoJSONFeature[]
}