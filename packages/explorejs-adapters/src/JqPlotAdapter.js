import {DataSource} from 'explorejs-lib';
import moment from 'moment';
import _ from 'underscore';
export default class JqPlotAdapter {
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
                    renderer: this.$.jqplot.DateAxisRenderer,
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
                color: '#8DD1DB',
            },
            cursor: {
                show: true,
                zoom: true,
                showTooltip: false,
                looseZoom: true,
                constrainZoomTo: 'x'
            },


        });

        var throttledUpdate = _.debounce(range=> {
            this.dataSource.updateViewState(range.start, range.end, this.plot._width);
        }, 100);

        this.chart.on('jqplotPostReplot', ()=> {
            throttledUpdate(this.getDisplayedRange());
        });
        this.chart.on('jqplotZoom', ()=> {
            const range = this.getDisplayedRange();
            this.setDisplayedRange(range.start, range.end);
            throttledUpdate(range);
        });


        var replot = this.plot.replot;
        this.plot.replot = (opts = {})=> {
            var data = opts.data || this.plot.data;
            var range = this.getDisplayedRange();
            const boundFilter = data=>data[1] != null && !isNaN(data[1]) && data[0] >= range.start && data[0] <= range.end;
            const maxRed = (acc, val)=>Math.max(acc, val[1]);
            const minRed = (acc, val)=>Math.min(acc, val[1]);
            if (data.length == 3) {
                var max = data[0].filter(boundFilter).reduce(maxRed, Number.NEGATIVE_INFINITY);
                var min = data[2].filter(boundFilter).reduce(minRed, Number.POSITIVE_INFINITY);
                if (!opts.axes) {
                    opts.axes = {};
                }
                opts.axes.yaxis = {
                    min: min,
                    max: max
                }
            }
            // debugger
            return replot.call(this.plot, opts);
        };

        this.plot.doFillBetweenLines = function () {
            var fb = this.fillBetween;
            var sid1 = fb.series1;
            var sid2 = fb.series2;
            // first series should always be lowest index
            var id1 = (sid1 < sid2) ? sid1 : sid2;
            var id2 = (sid2 > sid1) ? sid2 : sid1;

            var series1 = this.series[id1];
            var series2 = this.series[id2];


            if (series2.renderer.smooth) {
                var tempgd = series2.renderer._smoothedData.slice(0).reverse();
            }
            else {
                var tempgd = series2.gridData.slice(0).reverse();
            }

            if (series1.renderer.smooth) {
                var gd = series1.renderer._smoothedData.concat(tempgd);
            }
            else {
                var gd = series1.gridData.concat(tempgd);
            }

            gd = gd.filter(function (a) {
                return a[1] != null;
            });

            var color = (fb.color !== null) ? fb.color : this.series[sid1].fillColor;
            var baseSeries = (fb.baseSeries !== null) ? fb.baseSeries : id1;

            // now apply a fill to the shape on the lower series shadow canvas,
            // so it is behind both series.
            var sr = this.series[baseSeries].renderer.shapeRenderer;
            var opts = {fillStyle: color, fill: true, closePath: true};
            sr.draw(series1.shadowCanvas._ctx, gd, opts);
        };


        this.plot.replot();
    }


    getDisplayedRange() {
        var a = this.plot.axes.xaxis;
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

        const values = dataDiff.result.map(a=>[a.start, a.levelId == 'raw' ? a.data.v : a.data.a]);
        const tValues = dataDiff.result.map(a=>[a.start, a.levelId == 'raw' ? a.data.v : a.data.t]);
        const bValues = dataDiff.result.map(a=>[a.start, a.levelId == 'raw' ? a.data.v : a.data.b]);
        this.plot.replot({
            data: [
                tValues, bValues, values
            ]
        });


        this.debugCallback(values.length);

    }
}