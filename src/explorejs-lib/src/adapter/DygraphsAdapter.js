import DataSource from "../modules/DataSource";
import moment from 'moment';
import _ from 'underscore';
export default class DygraphsAdapter {
    /**
     *
     * @param {SerieCache} serieCache
     * @param graph2d
     * @param dataset
     * @param groups
     */
    constructor(serieCache, chart, $, Dygraphs, debugCallback) {

        this.onProjectionRecompile = this.onProjectionRecompile.bind(this);
        this.dataSource = new DataSource(serieCache, this.onProjectionRecompile);
        this.chart = chart;
        this.Dygraphs = Dygraphs;
        this.$ = $;
        this.debugCallback = debugCallback;
        this.init();
    }


    init() {

        const updateViewStateBasedOnDisplayedRange = ()=> {
            if (this.plot) { //ignore first time callback
                var range = this.getDisplayedRange();
                this.dataSource.getViewState().updateRangeAndViewportWidth(range, this.plot.getArea().w);
            }
        };
        this.plot = new this.Dygraphs(this.chart.attr('id'), [[new Date(), [0, 250, 300]]], {
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


    }


    getDisplayedRange() {
        var a = this.plot.xAxisRange();
        return {start: a[0], end: a[1]};
    }

    setDisplayedRange(start, end) {
        start = new Date(start).getTime();
        end = new Date(end).getTime();
        this.plot.updateOptions({dateWindow: [start, end]});
    }


    onProjectionRecompile() {

        var result = this.dataSource.getWrappers();

        console.time('adapter update');
        const bars = result.map(a=>[new Date(a.start), a.levelId == 'raw' ? [a.data.v, a.data.v, a.data.v] : [a.data.b, a.data.a, a.data.t]]);

        this.plot.updateOptions({
            file: bars
        });
        console.timeEnd('adapter update');
        this.debugCallback(bars.length);

    }
}