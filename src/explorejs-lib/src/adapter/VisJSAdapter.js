import DataSource from "../modules/DataSource";
import moment from 'moment';
export default class VisJSAdapter {
    /**
     *
     * @param {SerieCache} serieCache
     * @param graph2d
     * @param dataset
     * @param groups
     */
    constructor(serieCache, chart, vis, debugCallback) {
        this.vis = vis;
        this.chart = chart;
        this.onProjectionRecompile = this.onProjectionRecompile.bind(this);
        this.dataSource = new DataSource(serieCache, this.onProjectionRecompile);

        this.init();
        this.graph.on('rangechanged', (e)=> {
            this.dataSource.getViewState().updateRangeAndViewportWidth({
                start: e.start.getTime(),
                end: e.end.getTime()
            }, this.graph.body.dom.center.clientWidth);
        });

        this.debugCallback = debugCallback;
    }

    init() {
        var groups = new this.vis.DataSet();
        groups.add({
            id: 0,
            content: 'test',

            options: {

                shaded: {
                    orientation: 'bottom' // top, bottom
                },
            },


        });

        var items = [];

        var dataset = new this.vis.DataSet(items, {
            queue: true
        });
        var options = {
            defaultGroup: 'ungrouped',
            // legend: true,
            start: '2016-01-01 09:55',
            end: '2016-01-01 10:07',
            interpolation: false,
            height: 200,
            drawPoints: false,
            sort: false
        };

        this.dataset = dataset;
        var graph2d = new this.vis.Graph2d(this.chart[0], dataset, groups, options);
        this.graph = graph2d;
        this.groups = groups;

    }

    onProjectionRecompile(diff) {
        const f = 'YYYY-MM-DD HH:mm:ss';

        function id(p) {
            var start = p.start;
            var end = p.end;
            return moment(start).format(f) + "~" + moment(end).format(f) + '@' + p.levelId;
        }

        var result = this.dataSource.getWrappers();


        this.dataset.clear();

        this.dataset.add([].concat(result).map(a=>({
            x: a.start, y: a.levelId == 'raw' ? a.data.v : a.data.a, levelId: a.levelId, id: id(a)
        })));

        this.dataset.flush();


        this.debugCallback(this.dataset.length);
    }

    getDisplayedRange() {
        return {start: this.graph.getWindow().start.getTime(), end: this.graph.getWindow().end.getTime()}
    }

    setDisplayedRange(start, end) {
        this.graph.setWindow(start, end);
    }


}