import Range from 'explorejs-common/src/Range';
import DiffRangeSet from 'explorejs-common/src/DiffRangeSet';
import Array from 'explorejs-common/src/Array';
import DataUtil from "../data/DataUtil";
/**
 * The cache of exact data that chart has (wrappers)
 * Note that number of wrappers is not so huge, as chart has to store only displayed (or close to display) points
 */
export default class WrapperDisplayCache {


    /**
     *
     * @param serieCache {SerieCache}
     */
    constructor(serieCache) {
        this.serieCache = serieCache;
        this.wrappers = [];
    }


    /**
     * Returns array of wrapped data points, where outer wrappers have adjusted boundaries according to given range
     * @param range
     * @private
     * @return {RangeType[]}
     */
    _wrapRange(range) {
        var dataPoints = this.serieCache.getLevelCache(range.levelId).getRange(Range[range.levelId == 'raw' ? 'leftClosed' : 'opened'](range.start, range.end));
        var boundGetter = DataUtil.boundGetter(range.levelId);
        var wrappers = dataPoints.map(d=>({
            data: d,
            start: boundGetter.start(d),
            end: boundGetter.end(d),
            levelId: range.levelId
        }));
        if (wrappers.length) {
            wrappers[0].start = Math.max(wrappers[0].start, range.start);
            wrappers[wrappers.length - 1].end = Math.min(wrappers[wrappers.length - 1].end, range.end);
        }
        return wrappers;
    }

    /**
     * Updates wrappers by added and removed specification, returs effective diff
     * Added ranges have higher priority in case common part is removed and added at same time
     * @param added
     * @param removed
     * @private
     */
    _patchWrappers(added, removed) {
        const copyFn = r => ({
            data: r.data,
            levelId: r.levelId
        });
        const cmpFn = (a, b)=>a.data.id == b.data.id;
        const cloneRange = r=>({start: r.start, end: r.end, data: r.data, levelId: r.levelId});


        var removeDiff = DiffRangeSet.subtract(this.wrappers, removed, null, null, null, null, copyFn);

        var addDiff = DiffRangeSet.add(removeDiff.result.map(cloneRange), added, null, null, null, null, copyFn, cmpFn);
        var totalDiff = {
            removed: Array.mergeSorted(removeDiff.removed, addDiff.removed),
            added: Array.mergeSorted(removeDiff.added, addDiff.added),
            resized: Array.mergeSorted(removeDiff.resized, addDiff.resized),
            result: addDiff.result
        };
        this.wrappers = totalDiff.result.map(cloneRange);
        return totalDiff;
    }

    _getAddedAndRemovedFromResizedRanges(resized) {
        var added = [];
        var removed = [];

        resized.forEach((range)=> {
            // check if something is added on the left
            if (range.start < range.existing.start) {
                added.push({
                    start: range.start,
                    end: range.existing.start,
                    levelId: range.levelId
                });
            }
            // check if something is removed from left
            else if (range.start > range.existing.start) {
                removed.push({
                    start: range.existing.start,
                    end: range.start,
                    levelId: range.levelId
                });
            }
            // check if something is added on the right
            if (range.end > range.existing.end) {
                added.push({
                    start: range.existing.end,
                    end: range.end,
                    levelId: range.levelId
                });
            }
            // check if something is removed from right
            else if (range.end < range.existing.end) {
                removed.push({
                    start: range.end,
                    end: range.existing.end,
                    levelId: range.levelId
                });
            }
        });
        return {added, removed};
    }

    /**
     *
     * @param projectionDiff
     */
    update(projectionDiff) {
        const {added, removed} = this._getAddedAndRemovedFromResizedRanges(projectionDiff.resized);


        const mergedAdded = Array.mergeSorted(projectionDiff.added, added);
        const mergedRemoved = Array.mergeSorted(projectionDiff.removed, removed);

        var addedWrappers = mergedAdded.map(this._wrapRange.bind(this)).reduce((a, b)=>a.concat(b), []);
        var removedWrappers = mergedRemoved.map(this._wrapRange.bind(this)).reduce((a, b)=>a.concat(b), []);

        return this._patchWrappers(addedWrappers, removedWrappers);
    }
}

