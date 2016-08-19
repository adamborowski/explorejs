import DataSource from "../modules/DataSource";
import moment from 'moment';
export default class ZingAdapter {
    /**
     *
     * @param {SerieCache} serieCache
     * @param graph2d
     * @param dataset
     * @param groups
     */
    constructor(serieCache, zing) {
        this.onProjectionRecompile = this.onProjectionRecompile.bind(this);
        this.dataSource = new DataSource(serieCache, this.onProjectionRecompile);
        this.zing = zing;
        this.zing.bind('zoom', (a)=> {
            this.dataSource.updateViewState(a.xmin, a.xmax, document.querySelector('#main-chart').clientWidth);
        });
        // this.zing.exec('setseriesvalues', []);
        // var data = this.zing.exec('getseriesvalues');
        //todo init vis js configuration
        // graph2d.on('rangechanged', (e)=> {
        //     this.dataSource.updateViewState(e.start.getTime(), e.end.getTime(), graph2d.body.dom.center.clientWidth)
        // });
        // this.dataSource.updateViewState(graph2d.range.start, graph2d.range.end, graph2d.body.dom.center.clientWidth)
    }

    getDisplayedRange() {
        var a = this.zing.exec('getobjectinfo', {
            object: 'scale',
            name: 'scale-x'
        });
        return {start: a.minValue, end: a.maxValue};
    }

    setDisplayedRange(start, end) {
        start = new Date(start).getTime();
        end = new Date(end).getTime();
        this.zing.exec('zoomtovalues', {
            xmin: start,
            xmax: end,
        });
        return {start, end};
    }

    _makeValueIndex() {
        var map = {};
        const array = this.zing.exec('getseriesvalues')[0];
        if (array == null) {
            return {};
        }
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

        var map = this._makeValueIndex();


        console.time('wrapper diff');
        var dataDiff = this.dataSource.getWrapperDiffForProjectionDiff(diff);
        console.timeEnd('wrapper diff');

        const values = dataDiff.result.map(a=>[a.start, a.levelId == 'raw' ? a.data.v : a.data.a, a.data.b]);
        this.zing.exec('setseriesvalues', {
            plotIndex: 0,
            "aspect": "segment",
            values: [values]
        });

        console.info(this.zing.exec('getdata', {}));

        //
        //
        //
        //
        // if (dataDiff.added.length == 0 && dataDiff.removed.length == 0 && dataDiff.resized.length == 0) {
        //     console.info('no change after recompile');
        //     return;
        // }
        // console.time('chart data update');
        // this.dataset.remove([].concat(dataDiff.removed.map(a=>id(a)), dataDiff.resized.map(a=>id(a.existing))));
        // this.dataset.add([].concat(dataDiff.added, dataDiff.resized).map(a=>({
        //     x: a.start, y: a.levelId == 'raw' ? a.data.v : a.data.a, levelId: a.levelId, id: id(a)
        // })));
        // console.timeEnd('chart data update');
        // console.time('chart flush');
        // this.dataset.flush();
        // console.timeEnd('chart flush');
    }
}