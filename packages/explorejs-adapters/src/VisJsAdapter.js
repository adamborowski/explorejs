import {DataSource} from 'explorejs-lib';
import moment from 'moment';
import MouseWheelHelper from './helpers/MouseWheelHelper';
import throttle from './helpers/Throttle';
export default class VisJsAdapter {
    /**
     *
     * @param {SerieCache} serieCache
     * @param chart {HTMLElement} container for chart
     * @param vis reference to VisJS library
     */
    constructor(serieCache, chart, vis) {
        this.onProjectionRecompile = this.onProjectionRecompile.bind(this);
        this.dataSource = new DataSource(serieCache, this.onProjectionRecompile);

        this.chart = chart;

        const groups = new vis.DataSet();

        const blue = '#1a5375';

        [{id: 0, color: 'none'}, {id: 1, color: blue}, {id: 2, color: 'none'}].forEach(({id, color}) => groups.add({
            id,
            content: 'content ' + id,
            style: `stroke: ${color}; stroke-width:1`,
            options: {
                shaded: id === 2 ? {
                    orientation: 'group',
                    groupId: '0',
                    style: `fill: ${blue}`
                } : void 0
            }
        }));

        const items = [];

        const dataset = new vis.DataSet(items, {
            queue: true
        });
        const options = {
            defaultGroup: 'ungrouped',
            // legend: true,
            start: '2016-01-01 09:55',
            end: '2016-01-01 10:07',
            interpolation: false,
            height: 400,
            drawPoints: false,
            zoomable: false,
            moveable: false
        };
        const plot = new vis.Graph2d(chart, dataset, groups, options);

        this.plot = plot;

        plot.on('rangechanged', throttle(e => {

            console.time('range changed');
            console.timeEnd('range changed');
            console.time('handler');
            this.dataSource.getViewState().updateRangeAndViewportWidth({
                start: e.start.getTime(),
                end: e.end.getTime()
            }, plot.body.dom.center.clientWidth);
            console.timeEnd('handler');
        }, 100));
        // this.dataSource.getViewState().updateRangeAndViewportWidth(plot.range, plot.body.dom.center.clientWidth);
        this.dataset = dataset;
        this.groups = groups;

        this.wheelHelper = new MouseWheelHelper(
            this.chart,
            this.setDisplayedRange.bind(this),
            this.getDisplayedRange.bind(this),
            () => this.chart.querySelector('.vis-content').getBoundingClientRect());

    }

    onProjectionRecompile(diff) {
        const f = 'YYYY-MM-DD HH:mm:ss';

        function id(p, group) { // todo id should contain group
            var start = p.start;
            var end = p.end;

            // return group + '.' + moment(start).format(f) + '~' + moment(end).format(f) + '@' + p.levelId;
            return group + '.' + start + '~' + end + '@' + p.levelId;
        }

        const top = 0;
        const midAndValue = 1;
        const bottom = 2;

        console.time('wrapper diff');
        const dataDiff = this.dataSource.calculateWrappersDiffToPrevious();

        console.timeEnd('wrapper diff');
        if (dataDiff.added.length === 0 && dataDiff.removed.length === 0 && dataDiff.resized.length === 0) {
            console.info('no change after recompile');
            return;
        }
        console.time('chart data update');


        const toRemove = [];

        [...dataDiff.removed, ...dataDiff.resized.map(a => a.existing)].forEach(a => {
            if (a.levelId === 'raw') {
                toRemove.push(id(a, midAndValue));
            }
            else {
                toRemove.push(id(a, top));
                toRemove.push(id(a, midAndValue));
                toRemove.push(id(a, bottom));
            }
        });


        const toAdd = [];

        [...dataDiff.added, ...dataDiff.resized].forEach(a => {
            if (a.levelId === 'raw') {
                toAdd.push({
                    x: a.start, y: a.data.v, id: id(a, midAndValue), group: midAndValue
                });
            } else {
                toAdd.push({
                    x: a.start, y: a.data.t, id: id(a, top), group: top
                });
                toAdd.push({
                    x: a.start, y: a.data.a, id: id(a, midAndValue), group: midAndValue
                });
                toAdd.push({
                    x: a.start, y: a.data.b, id: id(a, bottom), group: bottom
                });
            }
        });

        this.dataset.remove(toRemove);
        this.dataset.add(toAdd);

        console.log(`Removed ${toRemove.length}, added ${toAdd.length}`);

        console.timeEnd('chart data update');
        console.time('chart flush');
        this.dataset.flush();
        console.timeEnd('chart flush');
    }

    getDisplayedRange() {
        const a = this.plot.getWindow();

        return {start: a.start.getTime(), end: a.end.getTime()};
    }

    setDisplayedRange(start, end) {
        start = new Date(start).getTime();
        end = new Date(end).getTime();
        this.plot.setWindow(start, end, {animation: false});
    }

    destroy() {
        this.wheelHelper.destroy();
        this.plot.destroy();
        this.dataSource.destroy();
    }
}
