export default class MarkerHandler {
    constructor(onClick) {
        this.onClick = onClick;
        this.visibleMarkers = [];
    }
    init(channel) {
        channel.handleEvent('MapClickedEvent', ({lon, lat, x, y, ctrlKeyDown}) => {
            this.onClick({lon, lat});
        });
    }
    synchronize(channel, state) {
        if (this.visibleMarkers === state.markers) {
            return; // relying on immutability; same identity -> no changes
        }

        // add & update
        const visibleMarkers = new Map(this.visibleMarkers.map((marker) => [marker.id, marker]));
        state.markers
            .filter((marker) => {
                const visibleMarker = visibleMarkers.get(marker.id);
                if (!visibleMarker) { // new location id
                    return true;
                }
                return visibleMarker !== marker; // relying on immutability; changed identity -> update
            })
            .forEach((marker) => {
                const markerDef = {
                    x: marker.lon,
                    y: marker.lat,
                    color: marker.selected ? '#f0f' : '#666',
                    shape: 2, // icon number (0-6)
                    size: 3
                }
                channel.postRequest('MapModulePlugin.AddMarkerRequest', [markerDef, marker.id]);
            });

        // delete
        const newMarkers = new Map(state.markers.map((marker) => [marker.id, marker]));
        const toDelete = this.visibleMarkers.filter((marker) => !newMarkers.has(marker.id));
        toDelete.forEach((marker) => {
            channel.postRequest('MapModulePlugin.RemoveMarkersRequest', [marker.id]);
        });

        this.visibleMarkers = state.markers;
    }
}