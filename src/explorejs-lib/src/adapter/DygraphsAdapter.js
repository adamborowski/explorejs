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
                console.info('update viewport!!')
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

    _makeValueIndex() {
        var map = {};
        const array = this.chart.series[0].data;
        for (var i = 0; i < array.length; i++) {
            map[array[i][0]] = i;
        }
        return map;
    }

    onProjectionRecompile(diff) {
        const f = 'YYYY-MM-DD HH:mm:ss';

        function id(p) {
            var start = p.start;
            var end = p.end;
            return moment(start).format(f) + "~" + moment(end).format(f) + '@' + p.levelId;
        }


        console.time('wrapper diff');
        var dataDiff = this.dataSource.getWrapperDiffForProjectionDiff(diff);
        console.timeEnd('wrapper diff');


        const bars = dataDiff.result.map(a=>[new Date(a.start), a.levelId == 'raw' ? [a.data.v, a.data.v, a.data.v] : [a.data.b, a.data.a, a.data.t]]);

        this.plot.updateOptions({
            file: bars
        });
        this.debugCallback(bars.length);

    }
}