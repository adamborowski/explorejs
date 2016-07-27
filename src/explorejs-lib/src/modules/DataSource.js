import DynamicProjection from './DynamicProjection';
import Range from 'explorejs-common/src/Range';
import WrapperCache from './WrapperCache';
import DataUtil from '../data/DataUtil';
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
        this.onProjectionChange = this.onProjectionChange.bind(this);
        this.dynamicProjection = new DynamicProjection();
        this.dynamicProjection.SerieCache = serieCache;
        this.dynamicProjection.setup(this.onProjectionChange);
        this.wrapperCache = new WrapperCache();
    }

    /**
     * Get data which have to be put on the chart due to projection/data ranges resize
     * @param resized {{start, end, levelId}[]} the array of ranges which are resized
     * @param output {WrapperDiffType}
     * @return {Array<{$s, $e, v, a, ...}>} array of original raw points, points come from different levels
     */
    extractWrapperDiffForResizedRanges(resized, output) {
        resized.forEach((range)=> {
            // check if something is added on the left
            if (range.start < range.existing.start) {
                this.extractWrapperDiffForRange({
                    start: range.start,
                    end: range.existing.start,
                    levelId: range.levelId
                }, true, output);
            }
            // check if something is removed from left
            else if (range.start > range.existing.start) {
                this.extractWrapperDiffForRange({
                    start: range.existing.start,
                    end: range.start,
                    levelId: range.levelId
                }, false, output);
            }
            // check if something is added on the right
            if (range.end > range.existing.end) {
                this.extractWrapperDiffForRange({
                    start: range.existing.end,
                    end: range.end,
                    levelId: range.levelId
                }, true, output);
            }
            // check if something is removed from right
            else if (range.end < range.existing.end) {
                this.extractWrapperDiffForRange({
                    start: range.end,
                    end: range.existing.end,
                    levelId: range.levelId
                }, false, output);
            }
        });
    }

    /**
     *
     * @param diff
     * @param output {WrapperDiffType}
     */
    extractWrapperDiffForRemovedRanges(removed, output) {
        for (var range of removed) {
            this.extractWrapperDiffForRange(range, false, output);
        }
    }

    extractWrapperDiffForAddedRanges(added, output) {
        for (var range of added) {
            this.extractWrapperDiffForRange(range, true, output);
        }
    }

    /**
     * Get diff for wrappers for insertion or removal data from source
     * @param range
     * @param register {boolean} if true, new wrappers will be added to wrapper cache, otherwise will be removed
     * @param output {WrapperDiffType}
     */
    extractWrapperDiffForRange(range, register, output) {
        const levelId = range.levelId;
        var levelCache = this.serieCache.getLevelCache(levelId);
        // for raw points we get all from <start, end)
        // for aggregations we get all from (start, end)
        if (levelCache == null) {
            throw new Error('LevelCache not found for ' + levelId);
        }
        var rawPoints = levelCache.getRange(Range[levelId == 'raw' ? 'leftClosed' : 'opened'](range.start, range.end));
        var numPoints = rawPoints.length;
        var lastPointIndex = numPoints - 1;
        var wrapperOperation = this.wrapperCache[register ? 'registerPointAtRange' : 'unregisterPointAtRange'].bind(this.wrapperCache);
        var bg = DataUtil.boundGetter(levelId);
        var dataPoint;

        if (numPoints == 1) {
            // add the only wrapper but adjust boundaries to the range
            dataPoint = rawPoints[0];
            appendToOutput(wrapperOperation(dataPoint, Math.max(range.start, bg.start(dataPoint)), Math.min(range.end, bg.end(dataPoint)), levelId));
        }
        else if (numPoints > 1) {
            // add first wrapper and adjust start boundary to range start
            dataPoint = rawPoints[0];
            appendToOutput(wrapperOperation(dataPoint, Math.max(range.start, bg.start(dataPoint)), bg.end(dataPoint), levelId));
            // add inner wrappers
            for (var i = 1; i < lastPointIndex; i++) {
                dataPoint = rawPoints[i];
                appendToOutput(wrapperOperation(dataPoint, bg.start(dataPoint), bg.end(dataPoint), levelId));
            }
            // add last wrapper and adjust end boundary to range end
            dataPoint = rawPoints[lastPointIndex];
            appendToOutput(wrapperOperation(dataPoint, bg.start(dataPoint), Math.min(range.end, bg.end(dataPoint)), levelId));

        }

        function appendToOutput(diff) {
            output.added = output.added.concat(diff.added);
            output.resized = output.resized.concat(diff.resized);
            output.removed = output.removed.concat(diff.removed);
        }
    }


    /**
     * Get data sufficient to update a chart
     * @param diff
     * @return {{newData: *, oldData: *}} newData - array of raw data to add to the chart without levelId - if levelId is needed, just check diff for range
     * for new data - special data wrapper: which level, actual range (note that it may be different than aggregation range after projeciton compilation), and actual data point
     */
    getWrapperDiffForProjectionDiff(diff) {
        var rangeDiff = {removed: [], resized: [], added: []};
        this.extractWrapperDiffForRemovedRanges(diff.removed, rangeDiff);
        this.extractWrapperDiffForResizedRanges(diff.resized, rangeDiff);
        this.extractWrapperDiffForAddedRanges(diff.added, rangeDiff);
        return rangeDiff;
    }

    onProjectionChange(diff) {
        //todo gather data from cache for new and resized ranges
        // todo gather only data visible for this viewport (when diff contains ranges exceeding this viewport + padding)
        // every range fill with "data" field with data gathered form cache
        this._callback(diff);
    }

    updateViewState(start, end, width) {
        return this.updateViewStateWithScale(start, end, (end - start) / width);
    }

    updateViewStateWithScale(start, end, scale) {
        // call dynamic projection to rebind for another projection and range
        this.dynamicProjection.updateViewStateWithScale(start, end, scale);
        // call prediction engine to allow it to request new data at specific levels
        // TODO this.predictionEngine.updateViewStateWithScale(start, end, scale);
        // TODO gain already existing cache - to juz sie powiadomi po zaloadowaniu skoro juz zaladowal
        // this is required to have projection range-scoped

    }
}
