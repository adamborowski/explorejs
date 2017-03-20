// for DynamicProjection and PredictionEngine
import {Event} from 'explorejs-common';
import _ from 'underscore';
const EVENT_NAME = 'update';

export default class ViewState {
    constructor(levels) {
        this._levels = levels;
        this._event = new Event();
        this._preferredUnitWidth = 1;
    }

    updateViewportWidth(value, update = true) {
        this._viewportWidth = value;
        update && this.update();
    }

    updatePreferredUnitWidth(value, update = true) {
        this._preferredUnitWidth = value;
        update && this.update();
    }

    updateRange(start, end, update = true) {
        this._start = start;
        this._end = end;
        update && this.update();
    }

    updateRangeAndViewportWidth(range, viewportWidth, update = true) {
        this._start = range.start;
        this._end = range.end;
        this._viewportWidth = viewportWidth;
        update && this.update();
    }

    /**
     * recalculates fit levelId after update of some properties
     * @private
     */
    update() {
        this._scale = (this._end - this._start) / this._viewportWidth;
        this._currentLevelId = this._calculateLevelId();
        //
        const newState = this.getState();

        if (!_.isEqual(newState, this._lastState)) {
            this._event.fireEvent(EVENT_NAME, this);
        }
        this._lastState = newState;
    }

    /**
     * Calculate the most fitting level based on avaliable levels, current viewport state and expected step unit width
     * The target is to have most grain segments not wider than this value.
     * @example if we set WantedUnitWidth = 100, we choose appropriate level unit to have 100 px width
     * start=0, end=100000, width = 500, scale = 200 (200 milliseconds/px)
     * raw (step=1000) will  display own data every 5 px (1000 ms /(200 ms/px))
     * 10s (step=10000) will display own data every 50px  (10000 ms / (200 ms/px))
     * 30s (step=30000) will display own data every 150px (30000 ms / (200 ms/px))
     * The question is: which level we should choose? The answer is: This one with displayed unit width the closest not greater than {@code WantedUnitWidth}.
     * So if in this case we have WantedUnitWidth = 100px, we choose 10s as 50px is the closest not greater than 100px
     * @param {number} scale milliseconds per one pixel on the viewport
     * @private
     */
    _calculateLevelId() {
        const levels = this._levels;
        const expectedUnitWidth = this._preferredUnitWidth;
        // go from the bigger level (eg. 1y) and find first with unit displayed width not greater than WantedUnitWidth

        for (let i = levels.length - 1; i >= 0; i--) {
            const level = levels[i];
            const unitWidth = level.step / this._scale;
            // console.log(`${level.id} will take ${unitWidth} ~ should be closely under ${expectedUnitWidth}`);

            if (unitWidth <= expectedUnitWidth) {
                return level.id;
                /* todo accept level if it not break new rule (minUnitWidth - np 0.8) if not return upper on -
                 because this will require too many data points, for example 10k on 1k wide chart*/
            }
        }
        return 'raw';
    }

    getCurentLevelId() {
        return this._currentLevelId;
    }

    getRange() {
        return {start: this._start, end: this._end};
    }

    getStart() {
        return this._start;
    }

    getEnd() {
        return this._end;
    }

    getViewportWidth() {
        return this._viewportWidth;
    }

    pixelsToTime(val) {
        return val * this._scale;
    }

    timeToPixels(val) {
        return val / this._scale;
    }

    getPreferredUnitWidth() {
        return this._preferredUnitWidth;
    }

    /**
     * how many time per pixel
     * @return {number|*}
     */
    getScale() {
        return this._scale;
    }

    getState() {
        return {
            currentLevelId: this.getCurentLevelId(),
            range: this.getRange(),
            viewportWidth: this.getViewportWidth(),
            preferredUnitWidth: this.getPreferredUnitWidth(),
            scale: this.getScale()
        };
    }

    getLevels() {
        return this._levels;
    }

    updateState(state) {
        if (state.currentLevelId != null) {
            throw new Error('Cannot update current level id, which is read only.');
        }
        if (state.range != null) {
            this.updateRange(state.range.start, state.range.end, false);
        }
        if (state.viewportWidth != null) {
            this.updateViewportWidth(state.viewportWidth, false);
        }
        if (state.preferredUnitWidth != null) {
            this.updatePreferredUnitWidth(state.preferredUnitWidth, false);
        }
        if (state.scale != null) {
            throw new Error('Cannot update scale, which is read only.');
        }
    }

    addListener(callback) {
        this._event.addListener(EVENT_NAME, callback);
    }

    removeListener(callback) {
        this._event.removeListener(EVENT_NAME, callback);
    }
}
