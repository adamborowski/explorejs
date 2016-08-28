import OrderedSegmentArray from "explorejs-common/src/OrderedSegmentArray"
import IndexedList from "explorejs-common/src/IndexedList";
import DiffRangeSet from "explorejs-common/src/DiffRangeSet";
import Range from 'explorejs-common/src/Range';
/**
 * Class to dynamically choose right ProjectionEvent, depending on current viewport settings (start, end, scale)
 * @property {SerieCache} SerieCache
 * @property {number} ScreenPadding - the ratio of with to be appended on both viewport sides
 * @property {number} WantedUnitWidth - how wide (in pixels) should be current level unit best displayed
 */
export default class DynamicProjection {
    /**
     *
     * @param viewState {ViewState}
     */
    constructor(viewState) {
        this.viewState = viewState;
        this.currentId = null;
        this.onProjectionRecompile = this.onProjectionRecompile.bind(this);
        viewState.addListener(this.onViewStateUpdate.bind(this));
    }

    onProjectionRecompile(diff) {
        this._callback(diff);
    }

    setup(callback) {
        this._callback = callback;
        this._levels = IndexedList.fromArray(this.SerieCache.getSerieManifest().levels, 'id');
        this._levels.add('raw', {levelId: 'raw', step: 1});
    }

    /**
     * pick right levelId rebind
     * @param viewState {ViewState}
     */
    onViewStateUpdate(viewState) {
        var newLevelId = viewState.getCurentLevelId();
        if (newLevelId != this.currentId) {
            if (this.currentEvent != null) {
                this.currentEvent.removeListener('recompile', this.onProjectionRecompile)
            }
            var oldId = this.currentId;
            this.currentId = newLevelId;
            this.currentEvent = this.SerieCache.getProjectionEventAtLevel(this.currentId);
            // this.currentEvent.addListener('recompile', paddedRange, this.onProjectionRecompile);
            this.currentEvent.addListener('recompile', Range.unbounded(), this.onProjectionRecompile);
            if (oldId != null) {
                var diff = this.callDiffDueToProjectionChange(oldId, newLevelId, Range.unbounded(), Range.unbounded());
                this.onProjectionRecompile(diff);
            }
        }

        // console.log(`update view state start=${start} end=${end} scale=${scale}, level=${this.currentId}`);


    }


    _copyFn(a) {
        return {levelId: a.levelId};
    }

    _compareFn(a, b) {
        return a.levelId == b.levelId;
    }

    callDiffDueToProjectionChange(currentLevelId, newLevelId, oldRange, newRange) {
        /* TODO call this.onProjectionRecompile with diff between old and new CacheProjection
         * 1. oldRanges: from old projecton get overlapping with old range
         * 2. newRanges: from new projection get overapping with new range
         * 3. if new projection is wider (cannot see raw, 10s, etc)
         * 3a. remove all unsupported ranges (iterate over old ranges and pick them) --> diff.removed
         * 3b. oldRanges.add(newRanges) --> diff.added, diff.resized, diff.removed (removed as result of joining two)
         * 4. if new projection is narrower (can see more, ex. raw, 10s, etc)
         * 4a. from oldRanges remove all newly supported ranges (iterate over new ranges and pick them) --> diff.removed, diff.added, diff.resized (added as a result of splitting)
         * 4b. oldRanges.add(new supported ranges) --> diff.added
         *  todo test it!!
         */
        var currentLevel = this._levels.get(currentLevelId);
        var newLevel = this._levels.get(newLevelId);
        var oldProjection = this.SerieCache.getProjectionDisposer().getProjection(currentLevelId);
        var newProjection = this.SerieCache.getProjectionDisposer().getProjection(newLevelId);
        var oldProjectionRanges = OrderedSegmentArray.splitRangeSetOverlapping(oldProjection.projection, oldRange.left, oldRange.right).overlap;
        var newProjectionRanges = OrderedSegmentArray.splitRangeSetOverlapping(newProjection.projection, newRange.left, newRange.right).overlap;
        var diff = {added: [], removed: [], resized: [], result: []};
        if (currentLevel.step < newLevel.step) {
            // change to wider, narrower ranges should disappear
            // remove all usupported ranges
            var rangesToRemove = this._getUnsupportedRanges(oldProjectionRanges, newLevel);
            var remainingRanges = DiffRangeSet.subtract(oldProjectionRanges, rangesToRemove, null, null, null, null, this._copyFn);
            diff.removed.push(...remainingRanges.removed);
            if (remainingRanges.added.length || remainingRanges.resized.length) {
                throw new Error("Somthing gone wrong, operands had to be not overlapping");
            }

            var newRanges = DiffRangeSet.add(remainingRanges.result, newProjectionRanges, null, null, null, null, this._copyFn, this._compareFn);
            diff.added.push(...newRanges.added);
            diff.removed.push(...newRanges.removed);
            diff.resized.push(...newRanges.resized);
            diff.result.push(...newRanges.result);

        } else {
            // change to narrower, narrower ranges may appear
            // from new projection get not supported by current level
            var rangesToAdd = this._getUnsupportedRanges(newProjectionRanges, currentLevel);
            var rangesWithHoles = DiffRangeSet.subtract(oldProjectionRanges, rangesToAdd, null, null, null, null, this._copyFn);
            diff.added.push(...rangesWithHoles.added);
            diff.removed.push(...rangesWithHoles.removed);
            diff.resized.push(...rangesWithHoles.resized);
            diff.result.push(...rangesWithHoles.result);

            diff.added.push(...rangesToAdd);
            diff.result.push(...rangesToAdd);

            diff.result.sort((a, b)=>a.start - b.start);
            diff.added.sort((a, b)=>a.start - b.start); // new supported ranges and splitted ranges may overlap
        }
        return diff;
    }

    /**
     * Return only ranges that are no more valid if previous level was narrower
     * @param rangeSet
     * @param newLevel
     * @return {*}
     * @private
     */
    _getUnsupportedRanges(rangeSet, newLevel) {
        return rangeSet.filter((r)=>this._levels.get(r.levelId).step < newLevel.step);
    }


    callDiffDueToRangeChange(oldRange, newRange) {
        // TODO call this.onProjectionRecompile with diff between old and new paddedRange
        // todo test it!!
        ;
    }
}