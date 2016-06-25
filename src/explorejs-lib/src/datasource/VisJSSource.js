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
        console.time('vis diff')
        // console.info(`diff, please add ${diff.added.length}, resize ${diff.resized.length}, remove ${diff.removed.length}`);
        console.time('vis diff removed')
        for (var remove of diff.removed) {
            var data = this.dataSource.serieCache.getLevelCache(remove.levelId).getRange(Range.leftClosed(remove.start, remove.end));
            console.info('removing points', data.length)
            var isRaw = remove.levelId == 'raw';
            if (isRaw) {
                this.dataset.remove(data.map(a=> a.$t)); // assume data never overlap
            } else {
                this.dataset.remove(data.map(a=> a.$s)); // assume data never overlap
            }
        }
        console.timeEnd('vis diff removed')
        console.time('vis diff resized')

        for (var resize of diff.resized) {
            var levelCache = this.dataSource.serieCache.getLevelCache(resize.levelId);
            var isRaw = resize.levelId == 'raw';
            if (resize.start < resize.existing.start) {// added to left
                var data = levelCache.getRange(Range.leftClosed(resize.start, resize.existing.start));
                if (isRaw) {
                    this.dataset.add(data.map(a=>({x: a.$t, y: a.v, id: a.$t}))); // assume data never overlap
                } else {
                    this.dataset.add(data.map(a=>({x: a.$s, y: a.a, id: a.$s}))); // assume data never overlap
                }
            }
            else {
                var data = levelCache.getRange(Range.leftClosed(resize.existing.start, resize.start)); //removed from left
                if (isRaw) {
                    this.dataset.remove(data.map(a=> a.$t)); // assume data never overlap
                } else {
                    this.dataset.remove(data.map(a=> a.$s)); // assume data never overlap

                }
            }

            if (resize.end > resize.existing.end) {// added to right
                var data = levelCache.getRange(Range.leftClosed(resize.existing.end, resize.end));
                if (isRaw) {
                    this.dataset.add(data.map(a=>({x: a.$t, y: a.v, id: a.$t}))); // assume data never overlap
                } else {
                    this.dataset.add(data.map(a=>({x: a.$s, y: a.a, id: a.$s}))); // assume data never overlap
                }
            }
            else {
                var data = levelCache.getRange(Range.leftClosed(resize.end, resize.existing.end)); //removed from right
                if (isRaw) {
                    this.dataset.remove(data.map(a=> a.$t)); // assume data never overlap
                } else {
                    this.dataset.remove(data.map(a=> a.$s)); // assume data never overlap

                }
            }
        }
        console.timeEnd('vis diff resized')
        console.time('vis diff added')


        for (var add of diff.added) {
            var data = this.dataSource.serieCache.getLevelCache(add.levelId).getRange(Range.leftClosed(add.start, add.end));
            console.info('adding points', data.length, data[0].$ss, data[data.length - 1].$ee, add.levelId);
            var isRaw = add.levelId == 'raw';
            if (isRaw) {
                this.dataset.remove(data.map(a=>a.$t)); // assume data never overlap
                this.dataset.add(data.map(a=>({x: a.$t, y: a.v, id: a.$t}))); // assume data never overlap
            } else {
                this.dataset.remove(data.map(a=>a.$s)); // assume data never overlap
                this.dataset.add(data.map(a=>({x: a.$s, y: a.a, id: a.$s}))); // assume data never overlap
            }
        }
        console.timeEnd('vis diff added')

        console.timeEnd('vis diff');
    }

    initVisInteraction() {
        this.vis.on('changeViewport_foo_bar', ()=> {
            this.dataSource.updateViewState(this.vis.viewport.start, this.vis.viewport.end, this.vis.viewport.displayWidth);
        });
    }
}