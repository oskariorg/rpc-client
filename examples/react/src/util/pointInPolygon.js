
import booleanPointInPolygon from '@turf/boolean-point-in-polygon';
import {point} from '@turf/helpers';

export default function pointInPolygon(lon, lat, feature) {
    if (!feature) {
        return false;
    }
    return booleanPointInPolygon(point([lon, lat]), feature);
}