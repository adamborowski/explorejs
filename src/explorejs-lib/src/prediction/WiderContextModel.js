import PredictionModel from "../modules/PredictionModel";
import Range from "explorejs-common/src/Range";
export default class WiderContextModel extends PredictionModel {

    constructor() {
        super();
        this.contextPaddingRatio = 1; // 0.5 of actual viewport width will be appeneded to left and right viewport window
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
            console.log('wider', widerLevel);
            this.SerieCache.getLevelCache(widerLevel).requestDataForRange(paddedWiderRange);
        }
    }

    getWiderLevel(levelId) {
        var ids = this.viewState.getLevels().map(a=>a.id);
        return ids[ids.indexOf(levelId) + 1];
    }
}