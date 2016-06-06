import DynamicProjection from "./DynamicProjection";
export default class DataSource {
    constructor(serieCache) {
        this.serieCache = serieCache;
        
        this.dynamicProjection = new DynamicProjection();
        this.dynamicProjection.SerieCache = serieCache;
        this.dynamicProjection.setup();
    }

    updateViewState(start, end, width) {
        return this.updateViewStateWithScale(start, end, (end - start) / width);
    }

    updateViewStateWithScale(start, end, scale) {
        // call dynamic projection to rebind for another projection and range
        this.dynamicProjection.updateViewStateWithScale(start, end, scale);
        // call prediction engine to allow it to request new data at specific levels
        // TODO this.predictionEngine.updateViewStateWithScale(start, end, scale);

    }
}
