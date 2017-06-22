import PredictionModel from '../modules/PredictionModel';
import {getScaleForLevel} from '../modules/LevelResolver';
import {Range} from 'explorejs-common';
export default class WiderContextModel extends PredictionModel {

    /**
     *
     * @param roundPrecision
     * @param levelShift if 0 - you should always see target level when zooming out, if 1 - you can sometimes see one level higher than expected,
     * 2 - two levels higher, etc
     */
    constructor(roundPrecision = 0.3, levelShift = 1) {
        super();
        this._levelShift = levelShift;
        this.contextPaddingRatio = 1; // 0.5 of actual viewport width will be appeneded to left and right viewport window
        this.roundPrecision = roundPrecision;
    }

    /**
     * For every level achievalbe by zooming out, calculate scale which will cause switching to projection of that level.
     * Then calculate length of viewport range at switch point
     * Note that we can zoom out from the middle, left, right, etc
     * Then calculate a range which will contain all possible ranges of viewport:
     *      [start, start+length] when scrolling from left, [end-length, end] when scrolling from right
     *      so to cover it, we pick [Min(start, end-length), Max(end, start+length)
     * Now we have a range which should be covered by level of switch point.
     * But we actually need to have one lower level loaded for this range, because it should cover when we are close to switching point but not yet at it
     *
     * Starting from that point, we can say how 'blurred' data we want to show at that time.
     * Ideally is to load target level, but maybe one-level or two-level fall back will save traffic and will be still acceptable
     *
     * Different explanation:
     *
     * Get all achievalble levels, and try to cover the range of switch point of next level, with target resolution (+0) or more 'blurred' resolution (+1, +2, etc)
     *
     *
     *
     */
    update() {
        const currentLevelId = this.viewState.getCurentLevelId();
        const start = this.viewState.getStart();
        const end = this.viewState.getEnd();
        const levelsInUse = this.getLevelsInUse(currentLevelId);

        const tryGetLevel = (index) => levelsInUse[Math.min(index, levelsInUse.length - 1)];

        for (let i = 1; i <= levelsInUse.length; i++) {
            const level = tryGetLevel(i);
            const lowerLevel = tryGetLevel(i - 1 + this._levelShift);
            const switchScale = getScaleForLevel(level, this.viewState.getPreferredUnitWidth());
            const switchWidth = switchScale * this.viewState.getViewportWidth();
            const tileWidth = Math.floor(1 * switchScale * this.viewState.getViewportWidth());
            const range = Range
                .leftClosed(end - switchWidth, start + switchWidth)
                .expandToFitPrecision(tileWidth);


            setTimeout(() => { // todo implement requestDataRange priorities so we do not put in
                // batch together witch urgent target level data from basic prediction model)
                this.SerieCache.getLevelCache(lowerLevel && lowerLevel.id)
                    .requestDataForRange(range);
            }, 200 /* simple workaround of lack of priorities */);
        }
    }

    /**
     * Returns levels used at projection to this aggregation level
     * @param levelId
     */
    getLevelsInUse(levelId) {
        const levels = this.viewState.getLevels();

        if (levelId === 'raw') {
            return levels;
        }
        return levels.slice(levels.findIndex(s => s.id === levelId));
    }
}
