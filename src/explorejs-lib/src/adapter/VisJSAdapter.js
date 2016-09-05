import DataSource from "../modules/DataSource";
import moment from 'moment';
import Array from 'explorejs-common/src/Array';
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
            id: '0',
            content: 'test',
            className: 'vis-graph-group5'
        });

        var items = [];

        var dataset = new this.vis.DataSet(items, {
            queue: true
        });
        var options = {
            defaultGroup: '0',
            // legend: true,
            start: '2016-01-01 09:55',
            end: '2016-01-01 10:07',
            interpolation: false,
            height: 200,
            drawPoints: false,
        };

        this.dataset = dataset;
        var graph2d = new this.vis.Graph2d(this.chart[0], dataset, groups, options);
        this.graph = graph2d;
        this.groups = groups;

    }

    onProjectionRecompile() {

        function id(p) {
            var start = p.start;
            var end = p.end;
            return start + "~" + end + '@' + p.levelId;
        }

        var diff = this.dataSource.calculateWrappersDiffToPrevious();


        this.dataset.remove(diff.removed.concat(diff.resized.map(a=>a.existing)).map(a=>id(a)));

        const mergeSorted = Array.mergeSorted(diff.added, diff.resized);
        this.dataset.add(mergeSorted.map(a=>({
            x: a.start, y: a.levelId == 'raw' ? a.data.v : a.data.a, levelId: a.levelId, id: id(a), group: '0'
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