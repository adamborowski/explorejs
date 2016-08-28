import DynamicProjection from './DynamicProjection';
import WrapperDisplayCache from './WrapperDisplayCache';
import PredictionEngine from "./PredictionEngine";
import ViewState from "./ViewState";
/**
 * @typedef {{added:WrapperType[], removed:WrapperType[], resized:WrapperType[]}} WrapperDiffType
 */
export default class DataSource {
    /**
     * @param {SerieCache} serieCache
     * @param callback
     */
    constructor(serieCache, callback) {
        this.serieCache = serieCache;
        this._callback = callback;
        this._viewState = new ViewState(this.serieCache.getSerieManifest().levels);
        this.dynamicProjection = new DynamicProjection(this._viewState);
        this.dynamicProjection.SerieCache = serieCache;
        this.dynamicProjection.setup(this._onProjectionChange.bind(this));
        this.wrapperCache = new WrapperDisplayCache(serieCache);
        this.predictionEngine = new PredictionEngine(serieCache, this._viewState);
    }

    /**
     * A method
     * Get data sufficient to update a chart
     * @param diff
     * @return {WrapperDiffType}
     * for new data - special data wrapper: which level, actual range (note that it may be different than aggregation range after projeciton compilation), and actual data point
     */
    getWrapperDiffForProjectionDiff(diff) {
        return this.wrapperCache.update(diff);
    }

    /**
     * Called by dynamic projection
     * @private
     * @param diff
     */
    _onProjectionChange(diff) {
        //todo gather data from cache for new and resized ranges
        // todo gather only data visible for this viewport (when diff contains ranges exceeding this viewport + padding)
        // every range fill with "data" field with data gathered form cache
        this._callback(diff);
    }

    getViewState() {
        return this._viewState;
    }

}