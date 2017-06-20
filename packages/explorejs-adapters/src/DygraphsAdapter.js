import {DataSource} from 'explorejs-lib';
import MouseWheelHelper from './helpers/MouseWheelHelper';
export default class DygraphsAdapter {
    /**
     *
     * @param {SerieCache} serieCache
     * @param chart {HTMLElement} element where put the chart
     * @param Dygraphs {Dygraphs} library reference
     */
    constructor(serieCache, chart, Dygraphs) {

        this.onProjectionRecompile = this.onProjectionRecompile.bind(this);
        this.dataSource = new DataSource(serieCache, this.onProjectionRecompile);
        this.chart = chart;
        this.Dygraphs = Dygraphs;
        this.init();
    }

    init() {

        const updateViewStateBasedOnDisplayedRange = () => {
            if (this.plot) { // ignore first time callback
                const range = this.getDisplayedRange();

                if (!this.plotIsUnderDataChange) {
                    this.dataSource.getViewState().updateRangeAndViewportWidth(range, this.plot.getArea().w);
                }
            }
        };

        this.plot = new this.Dygraphs(this.chart, [[new Date(), [0, 250, 300]]], {
            customBars: true,
            strokeWidth: 1,
            drawCallback: updateViewStateBasedOnDisplayedRange,
            zoomCallback: updateViewStateBasedOnDisplayedRange,
            axes: {
                y: {},
                x: {
                    axisLabelFormatter: this.Dygraphs.dateAxisLabelFormatter
                }
            }
        });
        setTimeout(() => this.plot.resize(), 500); // todo the hac of deferred css Todo solve the deferred css load problem - page jumping

        this.wheelHelper = new MouseWheelHelper(
            this.chart,
            this.setDisplayedRange.bind(this),
            this.getDisplayedRange.bind(this),
            () => {
                const rect = this.chart.getBoundingClientRect();
                const pad = this.plot.plotter_.area.x;

                return ({left: rect.left + pad, width: rect.width - pad});
            });

    }

    getDisplayedRange() {
        const a = this.plot.xAxisRange();

        return {start: a[0], end: a[1]};
    }

    setDisplayedRange(start, end) {
        start = new Date(start).getTime();
        end = new Date(end).getTime();
        this.plot.updateOptions({dateWindow: [start, end]});
    }

    onProjectionRecompile() {

        const result = this.dataSource.getWrappers();

        const bars = result.map(a => [new Date(a.start), a.levelId === 'raw' ? [a.data.v, a.data.v, a.data.v] : [a.data.b, a.data.a, a.data.t]]);

        this.plotIsUnderDataChange = true;
        this.plot.updateOptions({
            file: bars
        });
        delete this.plotIsUnderDataChange;

    }

    /**
     * Called when there is no more chart to display, this should unsubscribe from explorejs
     */
    destroy() {
        this.plot.destroy();
        this.dataSource.destroy();
        this.wheelHelper.destroy();
    }

    /**
     * TODO
     * FIXME
     * Support for gracefully cleanup of objects created for one view (DataSource, ViewState, DynamicProjection, etc), unsubscribe events
     */
}
