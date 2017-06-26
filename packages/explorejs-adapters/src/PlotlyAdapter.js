import {DataSource} from 'explorejs-lib';
import _ from 'underscore';
import MouseWheelHelper from './helpers/MouseWheelHelper';
export default class PlotlyAdapter {
    /**
     *
     * @param dataSource {DataSource}
     * @param chart {HTMLElement} the dom element where chart will be rendered
     * @param Plotly reference to plotly.js library
     */
    constructor(dataSource, chart, Plotly) {
        this.dataSource = dataSource;
        this.chart = chart;
        this.Plotly = Plotly;
        this.init();
    }

    init() {

        const color = '#bbddee';
        const borderColor = '#6699bb';

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
                    'connectgaps': true
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
                    'connectgaps': true
                }
            ],
            {
                margin: {t: 0},
                height: 380,
                yaxis: {
                    autorange: true
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
                scrollZoom: false
            }
        );

        const throttledUpdate = _.throttle(range => {
            this.dataSource.getViewState().updateRangeAndViewportWidth(range, this.chart.querySelector('.draglayer>g>rect.drag').width.baseVal.value);
        }, 100, {leading: true, trailing: true});

        this.chart.on('plotly_relayout', changed => {
            const range = changed['xaxis.range'] || [changed['xaxis.range[0]'], changed['xaxis.range[1]']];

            if (range !== undefined) {
                throttledUpdate(this.getDisplayedRange());
            }
        });

        this.wheelHelper = new MouseWheelHelper(
            this.chart,
            this.setDisplayedRange.bind(this),
            this.getDisplayedRange.bind(this),
            () => this.chart.querySelector('.bglayer').getBoundingClientRect());

        window.addEventListener('resize', this.onResize);

    }

    onResize = () => {
        this.Plotly.Plots.resize(this.chart);
    };

    getDisplayedRange() {
        const a = this.chart.layout.xaxis.range;

        return {start: new Date(a[0]).getTime(), end: new Date(a[1]).getTime()};
    }

    setDisplayedRange(start, end) {
        start = new Date(start).getTime();
        end = new Date(end).getTime();
        const update = {
            'xaxis.range': [start, end]
        };

        this.Plotly.relayout(this.chart, update);
    }

    _makeValueIndex() {
        const map = {};
        const array = this.chart.series[0].data;

        for (let i = 0; i < array.length; i++) {
            map[array[i][0]] = i;
        }
        return map;
    }

    onProjectionRecompile = () => {

        const dataDiff = this.dataSource.getWrappers();

        const values = dataDiff.map(a => a.levelId === 'raw' ? a.data.v : a.data.a);
        const tValues = dataDiff.map(a => a.levelId === 'raw' ? a.data.v : a.data.t);
        const bValues = dataDiff.map(a => a.levelId === 'raw' ? a.data.v : a.data.b);
        const times = dataDiff.map(a => a.start);

        this.Plotly.restyle(this.chart, {
            x: [times, times, times],
            y: [bValues, values, tValues]
        }, [0, 1, 2]);

    };

    /**
     * Called when there is no more chart to display, this should unsubscribe from explorejs
     */
    destroy() {
        this.Plotly.purge(this.chart);
        this.wheelHelper.destroy();
        this.dataSource.destroy();
        window.removeEventListener('resize', this.onResize);
    }
}
