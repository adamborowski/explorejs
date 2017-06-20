import PredictionModel from '../modules/PredictionModel';
import {getScaleForLevel} from '../modules/LevelResolver';
import {Range} from 'explorejs-common';
export default class WiderContextModel extends PredictionModel {

    constructor(roundPrecision = 0.3) {
        super();
        this.contextPaddingRatio = 1; // 0.5 of actual viewport width will be appeneded to left and right viewport window
        this.roundPrecision = roundPrecision;
    }

    update() {
        const currentLevelId = this.viewState.getCurentLevelId();
        const start = this.viewState.getStart();
        const end = this.viewState.getEnd();
        const widerLevels = this.getWiderLevels(currentLevelId);


        for (let i = 0; i < widerLevels.length; i++) {
            const level = widerLevels[i];
            const higherLevel = widerLevels[i + 1];
            const switchScale = getScaleForLevel(level, this.viewState.getPreferredUnitWidth());
            const switchWidth = switchScale * this.viewState.getViewportWidth();
            const tileWidth = Math.floor(1 * switchScale * this.viewState.getViewportWidth());

            const range = Range
                .closed(end - switchWidth, start + switchWidth)
                .expandToFitPrecision(tileWidth);

            this.SerieCache.getLevelCache(higherLevel && higherLevel.id || level.id)
                .requestDataForRange(range);
        }
    }

    getWiderLevels(levelId) {
        const levels = this.viewState.getLevels();

        return levels.slice(levels.findIndex(s => s.id === levelId) + 1);
    }
}
