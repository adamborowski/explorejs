import PredictionEngine from '../../../modules/PredictionEngine.js';
import ViewState from '../../../modules/ViewState.js';
import DataUtil from '../../../data/DataUtil.js';
import {DiffCalculator, Range} from 'explorejs-common';
/**
 * @typedef {{added:WrapperType[], removed:WrapperType[], resized:WrapperType[]}} WrapperDiffType
 */
export default class MockDataSource {
    /**
     * @param {SerieCache} serieCache
     * @param callback
     */
    constructor(serieCache) {
        this.serieCache = serieCache;
        this._viewState = new ViewState(this.serieCache.getSerieManifest().levels);
        this.predictionEngine = new PredictionEngine(serieCache, this._viewState);
        this._oldProjectionRanges = [];
        this._newProjectionRanges = [];
    }

    /**
     * Set wrapperCallback - called when a chart needs update
     */
    setUpdateCallback(callback) {
        this._callback = callback;
    }

    /**
     * Returns array of wrapped data points, where outer wrappers have adjusted boundaries according to given range
     * @param range
     * @private
     * @return {RangeType[]}
     */
    _wrapRange(levelId, mockData) {
        const dataPoints = mockData;
        const boundGetter = DataUtil.boundGetter(levelId);
        const wrappers = dataPoints.map(d => ({
            data: d,
            start: boundGetter.start(d),
            end: boundGetter.end(d),
            levelId: levelId
        }));

        return wrappers;
    }

    /**
     * It will wrap all ranges, the last with oneMore=true to have pa
     * @param ranges
     * @param lastOneMore
     * @private
     */
    _wrapRanges(ranges, lastOneMore = true) {
        const lastRangeIndex = ranges.length - 1;

        return ranges.map((r, i) => this._wrapRange(r, lastOneMore && i === lastRangeIndex)).reduce((a, b) => a.concat(b), []);
    }

    /**
     * A method
     * Get data sufficient to update a chart
     * @param diff
     * @return {WrapperDiffType}
     * for new data - special data wrapper: which level, actual range (note that it may be
     * different than aggregation range after projeciton compilation), and actual data point
     */
    calculateWrappersDiffToPrevious() {
        return DiffCalculator.compute(this._oldWrappers || [], this._newWrappers, {
            copyFn: a => ({
                levelId: a.levelId,
                data: a.data
            })
        });
    }

    mockNewData(response) {
        this._oldWrappers = this._newWrappers;
        this._newWrappers = this._wrapRange(response.level, response.data);
        this._callback();
    }

    getWrappers() {
        return this._newWrappers;
    }

    getViewState() {
        return this._viewState;
    }

    destroy() {
        this.predictionEngine.destroy();
    }
}
