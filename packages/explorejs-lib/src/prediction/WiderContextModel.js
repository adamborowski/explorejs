import PredictionModel from "../modules/PredictionModel";
import Range from "explorejs-common/src/Range";
export default class WiderContextModel extends PredictionModel {

    constructor(roundPrecision = 0.3) {
        super();
        this.contextPaddingRatio = 1; // 0.5 of actual viewport width will be appeneded to left and right viewport window
        this.roundPrecision = roundPrecision;
    }

    update() {
        var currentLevelId = this.viewState.getCurentLevelId();
        var start = this.viewState.getStart();
        var end = this.viewState.getEnd();
        var widerLevel = this.getWiderLevel(currentLevelId);
        if (widerLevel) {
            var padWiderStart = start - (end - start) * this.contextPaddingRatio;
            var padWiderEnd = end + (end - start) * this.contextPaddingRatio;
            var paddedWiderRange = Range.leftClosed(padWiderStart, padWiderEnd);
            this.SerieCache.getLevelCache(widerLevel).requestDataForRange(
                paddedWiderRange.expandToFitPrecision(this.viewState.pixelsToTime(this.roundPrecision * this.viewState.getViewportWidth())
                ));
        }
    }

    getWiderLevel(levelId) {
        var ids = this.viewState.getLevels().map(a=>a.id);
        return ids[ids.indexOf(levelId) + 1];
    }
}