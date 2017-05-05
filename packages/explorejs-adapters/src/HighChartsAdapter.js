import {DataSource} from 'explorejs-lib';
import moment from 'moment';
export default class HighChartsAdapter {
    /**
     *
     * @param {SerieCache} serieCache
     * @param graph2d
     * @param dataset
     * @param groups
     */
    constructor(serieCache, chart, HighCharts, debugCallback) {
        this.onProjectionRecompile = this.onProjectionRecompile.bind(this);
        this.dataSource = new DataSource(serieCache, this.onProjectionRecompile);
        this.chart = chart;
        this.debugCallback = debugCallback;
        HighCharts.addEvent(chart.xAxis[0], 'setExtremes', (e)=> {
            if (e.max === undefined) {
                setTimeout(()=> {
                    const range = this.getDisplayedRange();

                    this.dataSource.updateViewState(range.start, range.end, chart.plotWidth);
                }, 0);
            } else {
                this.dataSource.updateViewState(e.min, e.max, chart.plotWidth);
            }
        });
        // this.chart.exec('setseriesvalues', []);
        // var data = this.chart.exec('getseriesvalues');
        // todo init vis js configuration
        // graph2d.on('rangechanged', (e)=> {
        //     this.dataSource.updateViewState(e.start.getTime(), e.end.getTime(), graph2d.body.dom.center.clientWidth)
        // });
        // this.dataSource.updateViewState(graph2d.range.start, graph2d.range.end, graph2d.body.dom.center.clientWidth)
    }

    getDisplayedRange() {
        var a = this.chart.xAxis[0].getExtremes(0);

        return {start: a.min, end: a.max};
    }

    setDisplayedRange(start, end) {
        start = new Date(start).getTime();
        end = new Date(end).getTime();
        this.chart.xAxis[0].setExtremes(start, end);
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

            return moment(start).format(f) + '~' + moment(end).format(f) + '@' + p.levelId;
        }

        // var map = this._makeValueIndex();

        console.time('wrapper diff');
        var dataDiff = this.dataSource.getWrapperDiffForProjectionDiff(diff);

        console.timeEnd('wrapper diff');

        const aggregations = dataDiff.result.map(a=>[a.start, a.levelId == 'raw' ? null : a.data.b, a.levelId == 'raw' ? null : a.data.t]);
        const values = dataDiff.result.map(a=>[a.start, a.levelId == 'raw' ? a.data.v : a.data.a]);

        console.log(values);
        this.chart.series[0].setData(aggregations);
        this.chart.series[1].setData(values);

        this.debugCallback(values.length);

    }
}
