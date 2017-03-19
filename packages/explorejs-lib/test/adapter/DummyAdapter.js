import DataSource from '../../src/modules/DataSource';
const assert = (msg, bool) => {
    if (!bool) {
        throw new Error(msg);
    }
};
/**
 * @property {SerieCache} SerieCache
 */

export default class DummyAdapter {
    /**
     * Creates dummy adapter for testing purposes
     * @param initialStart
     * @param initialEnd
     * @param defaultPanStep
     * @param defaultZoomStep
     * @param chartWidth
     */
    constructor(initialStart = 0, initialEnd = 1000, defaultPanStep = 0.25, defaultZoomStep = 0.5, chartWidth = 1000) {

        this.defaultPanStep = defaultPanStep;
        this.defaultZoomStep = defaultZoomStep;
        this.chartWidth = chartWidth;

        this.currentWrappers = {};
        this.currentStart = initialStart;
        this.currentEnd = initialEnd;
    }

    setup() {
        this.dataSource = new DataSource(this.SerieCache, this.onProjectionRecompile);
    }

    panRight(step) {
        this._pan(step || this.defaultPanStep);
    }

    panLeft(step) {
        this._pan(-(step || this.defaultPanStep));
    }

    zoomIn(step) {
        this._zoom(step || this.defaultZoomStep);
    }

    zoomOut(step) {
        this._zoom(1 / (step || this.defaultZoomStep));
    }

    _pan(step) {
        var start = this.currentStart;
        var end = this.currentEnd;
        var length = end - start;
        var addition = length * step;

        this._setView(start + addition, end + addition);
    }

    _zoom(step) {
        var start = this.currentStart;
        var end = this.currentEnd;
        var middle = (end + start) / 2;
        var length = end - start;
        var addition = length * step;

        this._setView(middle - addition / 2, middle + addition / 2);
    }

    _setView(start, end) {
        this.currentStart = start;
        this.currentEnd = end;
        this.dataSource.updateViewState(start, end, this.chartWidth);
    }

    onProjectionRecompile(diff) {
        var wrapperDiff = this.dataSource.getWrapperDiffForProjectionDiff(diff);

        for (const wrapper of wrapperDiff.removed) {
            assert(`wrapper ${wrapper.id} should exist`, this.currentWrappers[wrapper.id] != null);
            delete this.currentWrappers[wrapper.id];
        }
        for (const wrapper of wrapperDiff.resized) {
            assert(`wrapper ${wrapper.id} should exist`, this.currentWrappers[wrapper.id] != null);
            delete this.currentWrappers[wrapper.existing.id];
            this.currentWrappers[wrapper.id] = wrapper;
        }
        for (const wrapper of wrapperDiff.added) {
            assert(`wrapper ${wrapper.id} shouldn't exist`, this.currentWrappers[wrapper.id] == null);
            this.currentWrappers[wrapper.id] = wrapper;
        }
    }

}
