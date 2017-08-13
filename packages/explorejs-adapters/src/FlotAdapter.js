import MouseWheelHelper from './helpers/MouseWheelHelper';
import throttle from './helpers/Throttle';

function init(plot) {
    var setupGrid = plot.setupGrid;

    plot.setupGrid = () => {
        plot.autoScale();
        var r = setupGrid.apply(plot, arguments);

        plot.getPlaceholder().trigger('plot_setupGrid');
        return r;
    };
    plot.autoScale = function () {
        var opts = plot.getYAxes()[0].options;
        var data = plot.getData();

        var xaxis = plot.getAxes().xaxis;
        const maxRed = (acc, val) => Math.max(acc, val[1]);
        const minRed = (acc, val) => Math.min(acc, val[1]);

        if (data.length == 3) {
            const boundFilter = data => data[1] != null && !isNaN(data[1]) && data[0] >= xaxis.options.min && data[0] <= xaxis.options.max;
            var max = data[0].data.filter(boundFilter).reduce(maxRed, Number.NEGATIVE_INFINITY);
            var min = data[1].data.filter(boundFilter).reduce(minRed, Number.POSITIVE_INFINITY);

            var margin = Math.abs(max - min) * opts.autoscaleMargin;

            opts.min = min - margin;
            opts.max = max + margin;
        }

        // plot.setupGrid();
        // plot.draw();

        return {
            min: opts.min,
            max: opts.max
        };
    };
}

export default class FlotAdapter {
    /**
     *
     * @param dataSource {DataSource}
     * @param chart {HTMLElement}
     * @param Flot {Flot}
     * @param $ {jQuery}
     */
    constructor(dataSource, chart, Flot, $) {

        $.plot.plugins.push({
            init: init,
            name: 'autoscalemode',
            version: '0.6'
        });

        this.onProjectionRecompile = this.onProjectionRecompile.bind(this);
        this.dataSource = dataSource;
        this.chart = chart;
        this.$chart = $(chart);
        this.Flot = Flot;
        this.$ = $;
        this.init();
    }

    init() {

        this.$chart.css('height', '300px');

        this.plot = this.$.plot(this.chart, [], {
            xaxis: {mode: 'time'},
            yaxis: {
                zoomRange: false,
                panRange: false,
                autoscaleMargin: 0.1
            },
            colors: ['#000000', '#000000', '#78a6a7']
        });

        this.throttledUpdate = throttle(() => {
            this.dataSource.getViewState().updateRangeAndViewportWidth(this.getDisplayedRange(), this.plot.width());
        }, 100);

        this.$chart.on('plot_setupGrid', this.throttledUpdate);

        setTimeout(() => this.plot.setupGrid(), 0);
        setTimeout(() => {
            this.plot.resize();
            this.plot.setupGrid();
            this.plot.draw();
        }, 1000); // todo the hac of deferred css Todo solve the deferred css load problem - page jumping

        this.wheelHelper = new MouseWheelHelper(
            this.chart,
            this.setDisplayedRange.bind(this),
            this.getDisplayedRange.bind(this),
            () => this.chart.getBoundingClientRect());

        window.addEventListener('resize', this.onResize);
    }

    getDisplayedRange() {
        var a = this.plot.getOptions().xaxes[0];

        return {start: a.min, end: a.max};
    }

    setDisplayedRange(start, end) {
        start = new Date(start).getTime();
        end = new Date(end).getTime();
        const a = this.plot.getOptions().xaxes[0];

        const number = 500000;

        if (end - start < number) {
            start = a.min;
            end = a.min + number;
        }

        a.min = start;
        a.max = end;
        this.plot.setupGrid();
        this.plot.draw();
    }

    onProjectionRecompile = () => {

        const wrappers = this.dataSource.getWrappers();

        const values = wrappers.map(a => [a.start, a.levelId === 'raw' ? a.data.v : a.data.a]);
        const tValues = wrappers.map(a => [a.start, a.levelId === 'raw' ? a.data.v : a.data.t]);
        const bValues = wrappers.map(a => [a.start, a.levelId === 'raw' ? a.data.v : a.data.b]);

        console.time('flot update')

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
                id: 'values', data: values, shadowSize: 0, lines: {lineWidth: 1}
            }
        ]);
        this.plot.setupGrid();
        this.plot.draw();

        console.timeEnd('flot update');

    };

    destroy() {
        this.wheelHelper.destroy();
        this.plot.destroy();
        this.dataSource.destroy();
        window.removeEventListener('resize', this.onResize);
        this.$chart.off('plot_setupGrid', this.throttledUpdate);
    }

    onResize = () => {
        this.plot.resize();
        this.plot.setupGrid();
        this.plot.draw();
    }
}
