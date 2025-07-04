import { Injectable } from "@angular/core";

@Injectable()
export class GoogleMapService {

    // To Convert degrees, minutes, seconds (DMS) coordinates to decimal degrees (DD).
    convertDMSToDD(dmsString: any) {
        dmsString = dmsString.trim();

        // ALL VALID SHAPES OF DMS INPUTS
        // Correctly parses DMS pairs with different separators, hemisphere at end
        // 59°12'7.7"N 02°15'39.6"W
        // 59º12'7.7"N 02º15'39.6"W
        // 59 12' 7.7" N 02 15' 39.6" W
        // 59 12'7.7''N 02 15'39.6'' W
        // 59:12:7.7"N 2:15:39.6W
        // 59 12’7.7’’N 02 15’39.6’’W

        // Correctly parses DMS pairs with hemisphere at beginning
        // N59°12'7.7" W02°15'39.6"
        // N 59°12'7.7" W 02°15'39.6"
        // N 59.20213888888889° W 2.261°
        // N 59.20213888888889 W 2.261
        // W02°15'39.6" N59°12'7.7"

        // Correctly parses different separators between lat / lon pairs
        // 59°12'7.7"N  02°15'39.6"W
        // 59°12'7.7"N , 02°15'39.6"W
        // 59°12'7.7"N,02°15'39.6"W

        // Will parse a single coordinate with hemisphere
        // 59°12'7.7"N
        // 02°15'39.6"W

        // Will parse a single coordinate with no hemisphere and return a number
        // 59°12'7.7"
        // 02°15'39.6"
        // -02°15'39.6"

        // Will infer first coordinate is lat, second lon, if no hemisphere letter is included
        // 59°12'7.7" -02°15'39.6"
        // 59°12'7.7", -02°15'39.6"

        // Correctly parses DMS with decimal minutes
        // N59°12.105' W02°15.66'
        // N59:12.105' W02:15.66'
        // N59:12.105 W02:15.66
        // 59:12.105'N 02:15.66'W

        // Correctly parses DMS with no minutes or seconds
        // 59°N 02°W

        // Parse decimal degrees as decimal degrees
        // 51.5, -0.126
        // 51.5,-0.126
        // 51.5 -0.126

        // Parse DMS with separators and spaces
        // 59° 12' 7.7" N 02° 15' 39.6" W
        // 59º 12' 7.7" N 02º 15' 39.6" W
        // 59 12’ 7.7’’N 02 15’ 39.6’’W

        // Inspired by https://gist.github.com/JeffJacobson/2955437
        // See https://regex101.com/r/kS2zR1/3
        var dmsRe = /([NSEW])?s?(-)?(d+(?:.d+)?)[°º:ds]?s?(?:(d+(?:.d+)?)['’‘′:]?s?(?:(d{1,2}(?:.d+)?)(?:"|″|’’|'')?)?)?s?([NSEW])?/i;

        var result: any = {};

        var m1, m2, decDeg1, decDeg2: any, dmsString2;

        m1 = dmsString.match(dmsRe);

        if (!m1) throw 'Could not parse string';

        // If dmsString starts with a hemisphere letter, then the regex can also capture the 
        // hemisphere letter for the second coordinate pair if also in the string
        if (m1[1]) {
            m1[6] = undefined;
            dmsString2 = dmsString.substr(m1[0].length - 1).trim();
        } else {
            dmsString2 = dmsString.substr(m1[0].length).trim();
        }

        decDeg1 = this.decDegFromMatch(m1);

        m2 = dmsString2.match(dmsRe);

        decDeg2 = m2 ? this.decDegFromMatch(m2) : {};

        if (typeof decDeg1.latLon === 'undefined') {
            if (!isNaN(decDeg1.decDeg) && isNaN(decDeg2.decDeg)) {
                // If we only have one coordinate but we have no hemisphere value,
                // just return the decDeg number
                return decDeg1.decDeg;
            } else if (!isNaN(decDeg1.decDeg) && !isNaN(decDeg2.decDeg)) {
                // If no hemisphere letter but we have two coordinates,
                // infer that the first is lat, the second lon
                decDeg1.latLon = 'lat';
                decDeg2.latLon = 'lon';
            } else {
                throw 'Could not parse string';
            }
        }

        // If we parsed the first coordinate as lat or lon, then assume the second is the other
        if (typeof decDeg2.latLon === 'undefined') {
            decDeg2.latLon = decDeg1.latLon === 'lat' ? 'lon' : 'lat';
        }

        result[decDeg1.latLon] = decDeg1.decDeg;
        result[decDeg2.latLon] = decDeg2.decDeg;

        return result;
    }

    decDegFromMatch = (m: any) => {
        var signIndex: any = {
            "-": -1,
            "N": 1,
            "S": -1,
            "E": 1,
            "W": -1
        };

        var latLonIndex: any = {
            "N": "lat",
            "S": "lat",
            "E": "lon",
            "W": "lon"
        };
        var degrees, minutes, seconds, sign, latLon;

        sign = signIndex[m[2]] || signIndex[m[1]] || signIndex[m[6]] || 1;
        degrees = Number(m[3]);
        minutes = m[4] ? Number(m[4]) : 0;
        seconds = m[5] ? Number(m[5]) : 0;
        latLon = latLonIndex[m[1]] || latLonIndex[m[6]];

        if (!this.inRange(degrees, 0, 180)) throw 'Degrees out of range';
        if (!this.inRange(minutes, 0, 60)) throw 'Minutes out of range';
        if (!this.inRange(seconds, 0, 60)) throw 'Seconds out of range';

        return {
            decDeg: sign * (degrees + minutes / 60 + seconds / 3600),
            latLon: latLon
        };
    }

    inRange = (value: any, a: any, b: any) => {
        return value >= a && value <= b;
    }
}