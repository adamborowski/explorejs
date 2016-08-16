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
    constructor(serieCache, graph2d, dataset, groups) {
        this.onProjectionRecompile = this.onProjectionRecompile.bind(this);
        this.dataSource = new DataSource(serieCache, this.onProjectionRecompile);
        //todo init vis js configuration
        graph2d.on('rangechanged', (e)=> {
            this.dataSource.updateViewState(e.start.getTime(), e.end.getTime(), graph2d.body.dom.center.clientWidth)
        });
        this.dataSource.updateViewState(graph2d.range.start, graph2d.range.end, graph2d.body.dom.center.clientWidth)
        this.dataset = dataset;
        this.groups = groups;
    }

    onProjectionRecompile(diff) {
        const f = 'YYYY-MM-DD HH:mm:ss';

        function id(p) {
            var start = p.start;
            var end = p.end;
            return moment(start).format(f) + "~" + moment(end).format(f) + '@' + p.levelId;
        }

        var dataDiff = this.dataSource.getWrapperDiffForProjectionDiff(diff);

        if (dataDiff.added.length == 0 && dataDiff.removed.length == 0 && dataDiff.resized.length == 0) {
            console.info('no change after recompile');
            return;
        }

        this.dataset.remove([].concat(dataDiff.removed.map(a=>id(a)), dataDiff.resized.map(a=>id(a.existing))));
        this.dataset.add([].concat(dataDiff.added, dataDiff.resized).map(a=>({
            x: a.start, y: a.levelId == 'raw' ? a.data.v : a.data.a, levelId: a.levelId, id: id(a)
        })));
        this.dataset.flush();
    }

    initVisInteraction() {
        this.vis.on('changeViewport_foo_bar', ()=> {
            this.dataSource.updateViewState(this.vis.viewport.start, this.vis.viewport.end, this.vis.viewport.displayWidth);
        });
    }
}