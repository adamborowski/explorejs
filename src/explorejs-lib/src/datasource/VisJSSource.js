import DataSource from "../modules/DataSource";
import Range from "explorejs-common/src/Range";
import moment from 'moment';
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

        var data = this.dataSource.getDataForDiff(diff);

        if (data.newData.length == 0 && data.oldData.length == 0) {
            console.info('no change after recompile');
            return;
        }

        console.time('vis diff removed');
        var removed = this.dataSource.getDataForRanges(data.oldData);


        this.dataset.remove(removed.map(id));
        this.dataset.flush();
        console.timeEnd('vis diff removed');

        console.time('vis diff added');
        var added = data.newData;

        this.dataset.add(added.map(w=>(w.levelId == 'raw' ?
        {
            x: w.start, y: w.data.v, id: id(w)
        } :
        {
            x: w.start, y: w.data.a, id: id(w)
        })));
        this.dataset.flush();
        console.timeEnd('vis diff added');
        console.timeEnd('vis diff');
        console.debug(removed.length + ' removed, ' + added.length + ' added.');

        // check coherency

        var chartItems = this.dataset.get();
        var projectionRanges = this.dataSource.serieCache.getProjectionDisposer().getProjection(this.dataSource.dynamicProjection.currentId).projection;
        var projectionItems = this.dataSource.getDataForRanges(projectionRanges);
        if (chartItems.length) {
            var chartIds = chartItems.map((a)=>a.id).sort().join('\n');
            var cacheIds = projectionItems.map((p)=>p.levelId == 'raw' ? id(p) : id({
                start: p.data.$s,
                end: p.data.$e,
                levelId: p.levelId
            })).sort().join('\n');
            if (chartIds != cacheIds) {
                var listener1 = function (e) {
                    e.clipboardData.clearData();
                    e.clipboardData.setData('text/plain', 'cache:\n' + cacheIds);
                    window.removeEventListener('copy', listener1);
                    window.addEventListener('copy', listener2);
                    e.preventDefault();
                };
                var listener2 = function (e) {
                    e.clipboardData.clearData();
                    e.clipboardData.setData('text/plain', 'chart:\n' + chartIds);
                    window.removeEventListener('copy', listener2);
                    e.preventDefault();
                };
                window.addEventListener('copy', listener1);
                console.error('incoherent cache');
                debugger
            }
            else {
                console.info('Cache and chart are coherent');
            }
        }
        else {
            console.warn('chart empty');
        }


    }

    initVisInteraction() {
        this.vis.on('changeViewport_foo_bar', ()=> {
            this.dataSource.updateViewState(this.vis.viewport.start, this.vis.viewport.end, this.vis.viewport.displayWidth);
        });
    }
}