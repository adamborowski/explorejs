import DataSource from '../modules/DataSource';
import moment from 'moment';
import _ from 'underscore';
export default class FlotAdapter {
    /**
     *
     * @param {SerieCache} serieCache
     * @param graph2d
     * @param dataset
     * @param groups
     */
    constructor(serieCache, chart, Flot, $, debugCallback) {

        this.onProjectionRecompile = this.onProjectionRecompile.bind(this);
        this.dataSource = new DataSource(serieCache, this.onProjectionRecompile);
        this.chart = chart;
        this.Flot = Flot;
        this.$ = $;
        this.debugCallback = debugCallback;
        this.init();
    }

    init() {

        this.plot = this.$.plot(this.chart, [], {

            xaxis: {mode: 'time'},
            yaxis: {
                zoomRange: false,
                panRange: false,
                autoscaleMargin: 0.1
            },
            pan: {
                interactive: true,
                cursor: 'move'
            },
            zoom: {
                interactive: true,
                mode: 'x'
            },
            colors: ['#000000', '#000000', '#78a6a7']
        });

        const throttledUpdate = _.debounce(range => {
            this.dataSource.updateViewState(range.start, range.end, this.plot.width());
        }, 100);

        this.chart.on('plot_setupGrid', () => {
            throttledUpdate(this.getDisplayedRange());
        });

        this.plot.setupGrid();
    }

    getDisplayedRange() {
        const a = this.plot.getOptions().xaxes[0];

        return {start: a.min, end: a.max};
    }

    setDisplayedRange(start, end) {
        start = new Date(start).getTime();
        end = new Date(end).getTime();
        const a = this.plot.getOptions().xaxes[0];

        a.min = start;
        a.max = end;
        this.plot.setupGrid();
        this.plot.draw();
    }

    _makeValueIndex() {
        const map = {};
        const array = this.chart.series[0].data;

        for (let i = 0; i < array.length; i++) {
            map[array[i][0]] = i;
        }
        return map;
    }

    onProjectionRecompile(diff) {
        const f = 'YYYY-MM-DD HH:mm:ss';

        /* eslint-disable */
        function id(p) {
            const start = p.start;
            const end = p.end;

            return moment(start).format(f) + '~' + moment(end).format(f) + '@' + p.levelId;
        }

        console.time('wrapper diff');
        const dataDiff = this.dataSource.getWrapperDiffForProjectionDiff(diff);

        console.timeEnd('wrapper diff');

        const values = dataDiff.result.map(a => [a.start, a.levelId == 'raw' ? a.data.v : a.data.a]);
        const tValues = dataDiff.result.map(a => [a.start, a.levelId == 'raw' ? a.data.v : a.data.t]);
        const bValues = dataDiff.result.map(a => [a.start, a.levelId == 'raw' ? a.data.v : a.data.b]);
        const times = dataDiff.result.map(a => a.start);

        this.plot.setData([
            {id: 'top', data: tValues, shadowSize: 0, lines: false},
            {
                id: 'bottom',
                data: bValues,
                lines: {show: true, lineWidth: 0, fill: 0.5, fillColor: '#8DD1DB'},
                fillBetween: 'top',
                shadowSize: 0
            },
            {
                id: 'values', data: values, shadowSize: 0, lines: {
                    lineWidth: 1
                }
            }
        ]);
        this.plot.setupGrid();
        this.plot.draw();

        this.debugCallback(values.length);

    }
}
