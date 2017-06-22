import PredictionModel from '../modules/PredictionModel';
import {Range} from 'explorejs-common';
export default class BasicViewportModel extends PredictionModel {

    constructor(contextPaddingRatio = 2, roundPrecision = 1) {
        super();
        this.contextPaddingRatio = contextPaddingRatio;
        this.roundPrecision = roundPrecision;
    }

    update() {
        var currentLevelId = this.viewState.getCurentLevelId();
        var start = this.viewState.getStart();
        var end = this.viewState.getEnd();
        const contextPadding = (end - start) * this.contextPaddingRatio;

        this.SerieCache.getLevelCache(currentLevelId).requestDataForRange(
            Range.leftClosed(start, end)
                .extend(contextPadding)
                .expandToFitPrecision(this.viewState.pixelsToTime(this.roundPrecision * this.viewState.getViewportWidth()))
        );
    }
}
