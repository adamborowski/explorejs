import {DataSource} from 'explorejs-lib';
import moment from 'moment';
import _ from 'underscore';
export default class PlotlyAdapter {
    /**
     *
     * @param {SerieCache} serieCache
     * @param graph2d
     * @param dataset
     * @param groups
     */
    constructor(serieCache, chart, Plotly, debugCallback) {
        this.onProjectionRecompile = this.onProjectionRecompile.bind(this);
        this.dataSource = new DataSource(serieCache, this.onProjectionRecompile);
        this.chart = chart;
        this.Plotly = Plotly;
        this.debugCallback = debugCallback;
        this.init();
    }


    init() {

        var color = '#bbddee';
        var borderColor = '#6699bb';

        this.Plotly.plot(this.chart,
            [
                {
                    x: [],
                    y: [],
                    type: 'scatter',
                    mode: 'fill',
                    fillcolor: color,
                    line: {
                        color: 'transparent'
                    },
                    "connectgaps": true,
                },
                {
                    x: [],
                    y: [],
                    fill: 'tonexty',
                    type: 'scatter',
                    line: {
                        color: borderColor,
                        width: 1
                    },
                    fillcolor: color
                },
                {
                    x: [],
                    y: [],
                    fill: 'tonexty',
                    type: 'scatter',
                    mode: 'none',
                    fillcolor: color,
                    "connectgaps": true,
                }
            ],
            {
                margin: {t: 0},
                height: 300,
                yaxis: {
                    autorange: true,
                    // fixedrange: true,
                    // rangeselector: {
                    //     visible: false
                    // }
                },
                xaxis: {
                    type: 'date'
                },
                showlegend: false
            },
            {
                scrollZoom: true
            }
        );

        var throttledUpdate = _.debounce(range=> {
            this.dataSource.updateViewState(range.start, range.end, this.chart.querySelector('.draglayer>g>rect.drag').width.baseVal.value);
        }, 100, true);
        this.chart.on('plotly_relayout', changed=> {
            const range = changed['xaxis.range'] || [changed['xaxis.range[0]'], changed['xaxis.range[1]']];
            if (range != null) {
                console.log('update', range[0], range[1]);
                throttledUpdate(this.getDisplayedRange());
            }
        });
    }


    getDisplayedRange() {
        var a = this.chart.layout.xaxis.range;
        return {start: a[0], end: a[1]};
    }

    setDisplayedRange(start, end) {
        start = new Date(start).getTime();
        end = new Date(end).getTime();
        var update = {
            'xaxis.range': [start, end]
        };
        this.Plotly.relayout(this.chart, update);
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

        const values = dataDiff.result.map(a=>a.levelId == 'raw' ? a.data.v : a.data.a);
        const tValues = dataDiff.result.map(a=>a.levelId == 'raw' ? a.data.v : a.data.t);
        const bValues = dataDiff.result.map(a=>a.levelId == 'raw' ? a.data.v : a.data.b);
        const times = dataDiff.result.map(a=>a.start);
        this.chart.data[0].x = times;
        this.chart.data[0].y = bValues;
        this.chart.data[1].x = times;
        this.chart.data[1].y = values;
        this.chart.data[2].x = times;
        this.chart.data[2].y = tValues;


        this.Plotly.redraw(this.chart);

        this.debugCallback(values.length);

    }
}