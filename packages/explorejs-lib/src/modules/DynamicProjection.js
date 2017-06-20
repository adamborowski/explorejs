import {OrderedSegmentArray, IndexedList, DiffCalculator, Range} from 'explorejs-common';
/**
 * Class to dynamically choose right ProjectionEvent, depending on current viewport settings (start, end, scale)
 * @property {SerieCache} SerieCache
 * @property {number} ScreenPadding - the ratio of with to be appended on both viewport sides
 * @property {number} WantedUnitWidth - how wide (in pixels) should be current level unit best displayed
 */
export default class DynamicProjection {
    /**
     * @param viewState {ViewState}
     * @param tileWidthRatio projection tile width, the ratio of viewport width
     * @param numTiles number of tiles to use in covering
     * @param paddingRatio the minimum padding of projection, added to viewport bounds
     */
    constructor(viewState, tileWidthRatio = 1, numTiles = 3, paddingRatio = 0.1) {
        // todo dlaczego mimo tiles, wykres tak czesto sie updateuje podczas panning

        this.viewState = viewState;
        this._paddingRatio = paddingRatio;
        this._tileWidthRatio = tileWidthRatio;
        this._numTiles = numTiles;
        this.currentLevelId = null;
        this.currentRange = null;
        this.cacheUpdateHandler = this.cacheUpdateHandler.bind(this);
        this.onViewStateUpdate = this.onViewStateUpdate.bind(this);
        viewState.addListener(this.onViewStateUpdate);
    }

    cacheUpdateHandler(name, range, listenerRange, diff) {
        const projectionTruncated = this.getProjectionTruncated(listenerRange.left, listenerRange.right);

        this._callback(projectionTruncated, 'cache update');
    }

    setup(callback) {
        this._callback = callback;
        this._levels = IndexedList.fromArray(this.SerieCache.getSerieManifest().levels, 'id');
        this._levels.add('raw', {levelId: 'raw', step: 1});
    }

    /**
     * pick right levelId rebind
     * Called only after view update - we can assume that cache is unchanged
     * So we can say that something has changed only if range / level changed
     * @param viewState {ViewState}
     */
    onViewStateUpdate(viewState) {
        const oldRange = this.currentRange;
        const newLevelId = viewState.getCurentLevelId();

        const scale = Math.floor(viewState.getScale());

        const tileWidth = Math.floor(this._tileWidthRatio * scale * viewState.getViewportWidth());
        const extension = Math.floor(this._paddingRatio * scale * viewState.getViewportWidth());
        const start = viewState.getStart();
        const end = viewState.getEnd();

        let newRange;

        const firstUpdate = oldRange == null;
        const levelChanged = newLevelId !== this.currentLevelId;
        const oldRangeIsNotSufficient = oldRange && (start - oldRange.left < extension || oldRange.right - end < extension);

        if (firstUpdate || levelChanged || oldRangeIsNotSufficient) {

            newRange = Range
                .opened(start, end)
                .extend(extension)
                .expandToFitPrecision(tileWidth);

            const numTilesUsed = newRange.length() / tileWidth;

            if (numTilesUsed > this._numTiles) {
                console.warn(`DynamicProjection: used more tiles (${numTilesUsed}) to cover than initially set ${this._numTiles}`);
            }

            for (let i = numTilesUsed; i < this._numTiles; i++) {
                const leftDistance = start - newRange.left;
                const rightDistance = newRange.right - end;


                if (leftDistance < rightDistance) {
                    newRange.left -= tileWidth;
                } else {
                    newRange.right += tileWidth;
                }
            }
        } else {
            // last range is still ok to show
            newRange = oldRange.clone();
        }

        if (this.currentEvent != null) {
            this.currentEvent.removeListener('recompile', this.cacheUpdateHandler);
        }

        this.currentLevelId = newLevelId;
        this.currentRange = newRange;
        this.currentEvent = this.SerieCache.getProjectionEventAtLevel(this.currentLevelId);
        this.currentEvent.addListener('recompile', this.currentRange, this.cacheUpdateHandler);
        if (firstUpdate || !oldRange.equals(newRange)) {
            // check if currentRange and newRange differ
            this._callback(this.getProjectionTruncated(newRange.left, newRange.right, newLevelId), 'view state update');
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
        return rangeSet.filter((r) => this._levels.get(r.levelId).step < newLevel.step);
    }

    destroy() {
        if (this.currentEvent) {
            this.currentEvent.removeListener('recompile', this.cacheUpdateHandler);
        }
        this.viewState.removeListener(this.onViewStateUpdate);
    }

}
