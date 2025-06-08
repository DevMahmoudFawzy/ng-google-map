export interface IGoogleMapMarker {

    // Required
    position: { lat: number, lng: number };

    /**
     * Only if you want to show custom icon for each location.
     * It could be a Node like HTMLImageElement or a google PinElement
     */
    icon?: Node | google.maps.marker.PinElement,

    /**
     * Only if you want to show a custom html content inside infoWindow for each location.
     * It could be a simple string Or html inside a string quotes Or any document element.
     */
    infoWindowContent?: string | Element | Text,

    /**
     * Only if you want to show a tooltip with title when hover on marker or info popup
     */
    title?: string
}