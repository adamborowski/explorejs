import OrderedSegmentArray from 'explorejs-common/src/OrderedSegmentArray';
import {IndexedList} from 'explorejs-common';
import DiffCalculator from 'explorejs-common/src/DiffCalculator';
import Range from 'explorejs-common/src/Range';
/**
 * Class to dynamically choose right ProjectionEvent, depending on current viewport settings (start, end, scale)
 * @property {SerieCache} SerieCache
 * @property {number} ScreenPadding - the ratio of with to be appended on both viewport sides
 * @property {number} WantedUnitWidth - how wide (in pixels) should be current level unit best displayed
 */
export default class DynamicProjection {
    /**
     * @param roundPrecision the resolution of range in relation to view state range
     * @param viewState {ViewState}
     */
    constructor(viewState, roundPrecision = 0.1) {
        this.viewState = viewState;
        this.currentLevelId = null;
        this.currentRange = null;
        this.roundPrecision = roundPrecision;
        this.cacheUpdateHandler = this.cacheUpdateHandler.bind(this);
        viewState.addListener(this.onViewStateUpdate.bind(this));
    }

    cacheUpdateHandler(name, range, listenerRange, diff) {
        const projectionTruncated = this.getProjectionTruncated(listenerRange.left, listenerRange.right);

        this._callback(projectionTruncated);
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
        const oldRange = this.currentRange;
        const newLevelId = viewState.getCurentLevelId();
        const newRange = Range
            .opened(viewState.getStart(), viewState.getEnd())
            .expandToFitPrecision(this.roundPrecision * viewState.getScale() * viewState.getViewportWidth());

        if (this.currentEvent != null) {
            this.currentEvent.removeListener('recompile', this.cacheUpdateHandler);
        }

        this.currentLevelId = newLevelId;
        this.currentRange = newRange;
        this.currentEvent = this.SerieCache.getProjectionEventAtLevel(this.currentLevelId);
        this.currentEvent.addListener('recompile', this.currentRange, this.cacheUpdateHandler);
        if (oldRange != null && !oldRange.equals(newRange)) {
            // check if currentRange and newRange differ
            this._callback(this.getProjectionTruncated(newRange.left, newRange.right, newLevelId));
        }
    }

    _copyFn(a) {
        return {levelId: a.levelId};
    }

    calcDiffDueToProjectionChange(currentLevelId, newLevelId, oldRange, newRange) {
        const oldProjection = this.SerieCache.getProjectionDisposer().getProjection(currentLevelId);
        const newProjection = this.SerieCache.getProjectionDisposer().getProjection(newLevelId);
        const oldCut = OrderedSegmentArray.cutRangeSet(oldProjection.projection, oldRange.left, oldRange.right, this._copyFn);
        const newCut = OrderedSegmentArray.cutRangeSet(newProjection.projection, newRange.left, newRange.right, this._copyFn);
        const oldProjectionRanges = oldCut.overlap;
        const newProjectionRanges = newCut.overlap;

        return DiffCalculator.compute(oldProjectionRanges, newProjectionRanges);
    }

    getProjectionTruncated(start, end, levelId = this.currentLevelId) {
        const oldProjection = this.SerieCache.getProjectionDisposer().getProjection(levelId);
        const oldCut = OrderedSegmentArray.cutRangeSet(oldProjection.projection, start, end, this._copyFn);

        return oldCut.overlap;
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

}
