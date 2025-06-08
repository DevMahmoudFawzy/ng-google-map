export interface IGeoJSONGeometry {
    type: 'Point' | 'LineString' | 'Polygon' | 'MultiPoint' | 'MultiLineString' | 'MultiPolygon' | 'GeometryCollection',
    coordinates?: any[],
    geometries?: IGeoJSONGeometry[]
}