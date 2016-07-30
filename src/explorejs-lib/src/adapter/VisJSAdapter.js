import DataSource from "../modules/DataSource";
import Range from "explorejs-common/src/Range";
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
        function id(p) {
            const f = 'HH:mm:ss';
            var start = p.start;
            var end = p.end;
            return moment(start).format(f) + "~" + moment(end).format(f) + '@' + p.levelId;
        }

        console.time('vis diff');
        // console.info(`diff, please add ${diff.added.length}, resize ${diff.resized.length}, remove ${diff.removed.length}`);

        var dataDiff = this.dataSource.getWrapperDiffForProjectionDiff(diff);

        if (dataDiff.added.length == 0 && dataDiff.removed.length == 0 && dataDiff.resized.length == 0) {
            console.info('no change after recompile');
            return;
        }

        console.time('vis diff removed');


        this.dataset.remove(dataDiff.removed.map(a=>a.id));
        this.dataset.remove(dataDiff.resized.map(a=>a.id));
        this.dataset.flush();
        console.timeEnd('vis diff removed');

        console.time('vis diff added');
        var added = dataDiff.added;

        this.dataset.add(added.map(w=>(w.levelId == 'raw' ?
        {
            x: w.start, y: w.data.v, id: w.id
        } :
        {
            x: w.start, y: w.data.a, id: w.id
        })));
        this.dataset.add(dataDiff.resized.map(w=>(w.levelId == 'raw' ?
        {
            x: w.start, y: w.data.v, id: w.id
        } :
        {
            x: w.start, y: w.data.a, id: w.id
        })));


        this.dataset.flush();
        console.timeEnd('vis diff added');
        console.timeEnd('vis diff');
        console.debug(dataDiff.removed.length + ' removed, ' + dataDiff.resized.length + ' resized, ' + added.length + ' added.');

    }

    initVisInteraction() {
        this.vis.on('changeViewport_foo_bar', ()=> {
            this.dataSource.updateViewState(this.vis.viewport.start, this.vis.viewport.end, this.vis.viewport.displayWidth);
        });
    }
}