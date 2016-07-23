import DynamicProjection from "./DynamicProjection";
import Range from "explorejs-common/src/Range";
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
    }

    /**
     * Get data which have to be put on the chart due to projection/data ranges resize
     * @param resized {{start, end, levelId}[]} the array of ranges which are resized
     * @return {Array<{$s, $e, v, a, ...}>} array of original raw points, points come from different levels
     */
    getNewDataForResizedRanges(resized) {
        return resized.map((range)=> {
            // check if somethind is added on the left
            if (range.start < range.existing.start) {
                return this.getDataWrappersForRange({
                    start: range.start,
                    end: range.existing.start,
                    levelId: range.levelId
                });
            }
            // check if somethind is added on the right
            if (range.end > range.existing.end) {
                return this.getDataWrappersForRange({
                    start: range.existing.end,
                    end: range.end,
                    levelId: range.levelId
                });
            }
            return [];
        }).reduce((a, b)=>a.concat(b), []);
    }

    getRemovedRangesForDiff(diff) {
        var result = [];
        result = result.concat(diff.removed);
        for (var range of diff.resized) {
            if (range.start > range.existing.start) {
                result.push({start: range.existing.start, end: range.start, levelId: range.levelId});
            }
            if (range.end < range.existing.end) {
                result.push({start: range.end, end: range.existing.end, levelId: range.levelId});
            }
        }
        return result;
    }

    getNewDataForAddedRanges(added) {
        return added.map((a)=>this.getDataWrappersForRange(a)).reduce((a, b)=>a.concat(b), []);
    }

    getDataForRanges(ranges) {
        return ranges.map((a)=>this.getDataWrappersForRange(a)).reduce((a, b)=>a.concat(b), []);
    }

    /**
     * NOTE: Should be test covered
     * Get every cache point wapped into object with additional information: levelId, effective time bounds, wrapped cache point
     * @param range
     */
    getDataWrappersForRange(range) {
        const levelId = range.levelId;
        var levelCache = this.serieCache.getLevelCache(levelId);
        // for raw points we get all from <start, end)
        // for aggregations we get all from (start, end)
        var rawPoints = levelCache.getRange(Range[levelId == 'raw' ? 'leftClosed' : 'opened'](range.start, range.end));
        var wrappers;
        if (levelId == 'raw') {
            wrappers = rawPoints.map(p=>({levelId, start: p.$t, end: p.$t, data: p}))
        }
        else {
            wrappers = rawPoints.map(p=>({levelId, start: p.$s, end: p.$e, data: p}))
        }
        if (wrappers.length) {
            // narrow outer wrappers to fit the range
            wrappers[0].start = Math.max(wrappers[0].start, range.start);
            wrappers[wrappers.length - 1].end = Math.min(wrappers[wrappers.length - 1].end, range.end);
        }
        return wrappers;
    }


    /**
     * Get data sufficient to update a chart
     * @param diff
     * @return {{newData: *, oldData: *}} newData - array of raw data to add to the chart without levelId - if levelId is needed, just check diff for range
     * for new data - special data wrapper: which level, actual range (note that it may be different than aggregation range after projeciton compilation), and actual data point
     */
    getDataForDiff(diff) {
        return {
            newData: this.getNewDataForAddedRanges(diff.added).concat(this.getNewDataForResizedRanges(diff.resized)),
            oldData: this.getRemovedRangesForDiff(diff)
        };
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
