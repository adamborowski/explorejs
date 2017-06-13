import {DataSource} from 'explorejs-lib';
import throttle from 'helpers/Throttle.js';
import MouseWheelHelper from './helpers/MouseWheelHelper';
export default class HighChartsAdapter {
    /**
     *
     * @param {SerieCache} serieCache
     * @param chart
     * @param HighCharts
     */
    constructor(serieCache, chart, HighCharts) {
        this.onProjectionRecompile = this.onProjectionRecompile.bind(this);
        this.dataSource = new DataSource(serieCache, this.onProjectionRecompile);
        this.chart = chart;

        this.plot = HighCharts.chart(chart, {
            chart: {
                height: 400,
                zoomType: 'x',
                panning: true,
                panKey: 'shift',
                animation: false
            },
            tooltip: {
                valueDecimals: 3
            },
            series: [
                {
                    data: [],
                    name: 'range',
                    type: 'areasplinerange',
                    step: true

                },
                {
                    name: 'average',
                    type: 'spline',
                    marker: {
                        enabled: false
                    },
                    data: [],
                    step: true
                }
            ],
            xAxis: {
                type: 'datetime'
            },
            title: {
                text: 'HighCharts + ExploreJS integration'
            }
        });

        HighCharts.addEvent(this.plot.xAxis[0], 'setExtremes', throttle((e) => {
            // toto highcharts seem to update better with diffs
            if (e.max === undefined) {
                setTimeout(() => {
                    const range = this.getDisplayedRange();

                    this.dataSource.getViewState().updateRangeAndViewportWidth(range, this.plot.plotWidth);
                }, 0);
            } else {
                this.dataSource.getViewState().updateRangeAndViewportWidth({
                    start: e.min,
                    end: e.max
                }, this.plot.plotWidth);
            }
        }), 1000);


        this.wheelHelper = new MouseWheelHelper(
            this.chart,
            this.setDisplayedRange.bind(this),
            this.getDisplayedRange.bind(this),
            () => {
                const rect = this.chart.getBoundingClientRect();
                const pad = this.plot.plotLeft;
                const width = this.plot.plotWidth;

                return {left: rect.left + pad, width};
            });

        this.onResize = () => {
            this.plot.redraw();
        }

        window.addEventListener('resize', this.onResize);
    }

    getDisplayedRange() {
        var a = this.plot.xAxis[0].getExtremes(0);

        return {start: a.min, end: a.max};
    }

    setDisplayedRange(start, end) {
        start = new Date(start).getTime();
        end = new Date(end).getTime();
        this.plot.xAxis[0].setExtremes(start, end);
    }

    onProjectionRecompile() {

        const result = this.dataSource.getWrappers();

        const aggregations = result.map(a => [a.start, a.levelId === 'raw' ? null : a.data.b, a.levelId === 'raw' ? null : a.data.t]);
        const values = result.map(a => [a.start, a.levelId === 'raw' ? a.data.v : a.data.a]);

        this.plot.series[0].setData(aggregations);
        this.plot.series[1].setData(values);

    }

    destroy() {
        this.wheelHelper.destroy();
        this.plot.destroy();
        this.dataSource.destroy();
        window.removeEventListener('resize', this.onResize);
    }
}
