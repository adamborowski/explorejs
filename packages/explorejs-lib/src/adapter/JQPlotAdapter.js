import DataSource from '../modules/DataSource';
import moment from 'moment';
import _ from 'underscore';
export default class JQPlotAdapter {
    /**
     *
     * @param {SerieCache} serieCache
     * @param graph2d
     * @param dataset
     * @param groups
     */
    constructor(serieCache, chart, $, debugCallback) {

        this.onProjectionRecompile = this.onProjectionRecompile.bind(this);
        this.dataSource = new DataSource(serieCache, this.onProjectionRecompile);
        this.chart = chart;
        this.$ = $;
        this.debugCallback = debugCallback;
        this.init();
    }

    init() {

        this.plot = this.$.jqplot(this.chart.attr('id'), [[0, 0]], {
            axes: {
                xaxis: {
                    renderer: this.$.jqplot.DateAxisRenderer
                },
                yaxis: {
                    autoscale: true
                }
            },
            series: [
                {
                    color: 'transparent'
                },
                {
                    color: 'transparent'
                },
                {
                    color: '#78a6a7'
                }
            ],
            seriesDefaults: {
                showMarker: false,
                shadow: false,
                lineWidth: 1,
                rendererOptions: {},
                breakOnNull: true
            },
            axesDefaults: {
                tickOptions: {
                    fontSize: '8pt'
                }
            },
            grid: {shadow: false},
            fillBetween: {
                fill: true,
                series1: [0],
                series2: [1],
                baseSeries: 0,
                color: '#8DD1DB'
            },
            cursor: {
                show: true,
                zoom: true,
                showTooltip: false,
                looseZoom: true,
                constrainZoomTo: 'x'
            }

        });

        const throttledUpdate = _.debounce(range => {
            this.dataSource.updateViewState(range.start, range.end, this.plot._width);
        }, 100);

        this.chart.on('jqplotPostReplot', () => {
            throttledUpdate(this.getDisplayedRange());
        });
        this.chart.on('jqplotZoom', () => {
            const range = this.getDisplayedRange();

            this.setDisplayedRange(range.start, range.end);
            throttledUpdate(range);
        });

        const replot = this.plot.replot;

        this.plot.replot = (opts = {}) => {
            const data = opts.data || this.plot.data;
            const range = this.getDisplayedRange();
            const boundFilter = data => data[1] != null && !isNaN(data[1]) && data[0] >= range.start && data[0] <= range.end;
            const maxRed = (acc, val) => Math.max(acc, val[1]);
            const minRed = (acc, val) => Math.min(acc, val[1]);

            if (data.length === 3) {
                const max = data[0].filter(boundFilter).reduce(maxRed, Number.NEGATIVE_INFINITY);
                const min = data[2].filter(boundFilter).reduce(minRed, Number.POSITIVE_INFINITY);

                if (!opts.axes) {
                    opts.axes = {};
                }
                opts.axes.yaxis = {
                    min: min,
                    max: max
                };
            }
            // debugger
            return replot.call(this.plot, opts);
        };

        this.plot.doFillBetweenLines = function () {
            let gd;
            let tempgd;
            const fb = this.fillBetween;
            const sid1 = fb.series1;
            const sid2 = fb.series2;
            // first series should always be lowest index
            const id1 = (sid1 < sid2) ? sid1 : sid2;
            const id2 = (sid2 > sid1) ? sid2 : sid1;

            const series1 = this.series[id1];
            const series2 = this.series[id2];

            if (series2.renderer.smooth) {
                tempgd = series2.renderer._smoothedData.slice(0).reverse();
            } else {
                tempgd = series2.gridData.slice(0).reverse();
            }

            if (series1.renderer.smooth) {
                gd = series1.renderer._smoothedData.concat(tempgd);
            } else {
                gd = series1.gridData.concat(tempgd);
            }

            gd = gd.filter(function (a) {
                return a[1] != null;
            });

            const color = (fb.color !== null) ? fb.color : this.series[sid1].fillColor;
            const baseSeries = (fb.baseSeries !== null) ? fb.baseSeries : id1;

            // now apply a fill to the shape on the lower series shadow canvas,
            // so it is behind both series.
            const sr = this.series[baseSeries].renderer.shapeRenderer;
            const opts = {fillStyle: color, fill: true, closePath: true};

            sr.draw(series1.shadowCanvas._ctx, gd, opts);
        };

        this.plot.replot();
    }

    getDisplayedRange() {
        const a = this.plot.axes.xaxis;

        return {start: a.min, end: a.max};
    }

    setDisplayedRange(start, end) {
        start = new Date(start).getTime();
        end = new Date(end).getTime();
        this.plot.replot({
            axes: {
                xaxis: {
                    min: start,
                    max: end
                }
            }
        });
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

        const values = dataDiff.result.map(a => [a.start, a.levelId === 'raw' ? a.data.v : a.data.a]);
        const tValues = dataDiff.result.map(a => [a.start, a.levelId === 'raw' ? a.data.v : a.data.t]);
        const bValues = dataDiff.result.map(a => [a.start, a.levelId === 'raw' ? a.data.v : a.data.b]);

        this.plot.replot({
            data: [
                tValues, bValues, values
            ]
        });

        this.debugCallback(values.length);

    }
}
