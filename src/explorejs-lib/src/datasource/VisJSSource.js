import DataSource from "../modules/DataSource";
import Range from "explorejs-common/src/Range";
export default class VisJSSource {
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
        // for (var level of serieCache.getSerieManifest().levels) {
        //     var groupConf = {id: level.id, content: level.id};
        //     if (level == 'raw') {
        //
        //     }
        //     else {
        //
        //     }
        //     this.groups.add(groupConf);
        // }
    }

    onProjectionRecompile(diff) {
        console.time('vis diff');
        // console.info(`diff, please add ${diff.added.length}, resize ${diff.resized.length}, remove ${diff.removed.length}`);

        var data = this.dataSource.getDataForDiff(diff);

        console.time('vis diff removed');
        var removed = this.dataSource.getDataForRanges(data.oldData);
        this.dataset.remove(removed.map(w=>w.levelId + w.start + w.end));
        console.timeEnd('vis diff removed');

        console.time('vis diff added');
        var added = data.newData;

        this.dataset.add(added.map(w=>(w.levelId == 'raw' ?
        {
            x: w.start, y: w.data.v, id: w.levelId + w.start + w.end
        } :
        {
            x: w.start, y: w.data.a, id: w.levelId + w.start + w.end
        })));
        this.dataset.flush();
        console.timeEnd('vis diff added');
        console.timeEnd('vis diff');
        console.debug(removed.length + ' removed, ' + added.length + ' added.');

    }

    initVisInteraction() {
        this.vis.on('changeViewport_foo_bar', ()=> {
            this.dataSource.updateViewState(this.vis.viewport.start, this.vis.viewport.end, this.vis.viewport.displayWidth);
        });
    }
}