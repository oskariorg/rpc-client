export default class DrawHandler {
    constructor(onFinish) {
        this.isDrawing = false;
        this.onFinish = onFinish;
    }
    init(channel) {
        channel.handleEvent('DrawingEvent', (data) => {
            if (!data.isFinished) {
                return;
            }
            if (!data.geojson.features.length || typeof data.geojson.features[0].properties.area !== 'number') {
                this.onFinish(null);
                return;
            }
            this.onFinish(data.geojson.features[0]);
        });
    }
    synchronize(channel, state) {
        if (this.isDrawing === state.isDrawing) {
            return;
        }

        if (state.isDrawing) {
            channel.postRequest('DrawTools.StartDrawingRequest', ['draw-handler', 'Polygon', {allowMultipleDrawing: false}]);
        } else {
            channel.postRequest('DrawTools.StopDrawingRequest', ['draw-handler', true]);
        }

        this.isDrawing = state.isDrawing;
    }
}