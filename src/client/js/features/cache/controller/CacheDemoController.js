import RequestManager from 'explorejs/src/modules/RequestManager';
import DataRequest from 'explorejs/src/data/DataRequest';
import CacheManager from "explorejs/src/modules/CacheManager";
import vis from "vis/dist/vis.js";
import VisSource from "explorejs/src/datasource/VisJSSource";
const vizWidth = 920;
export default class CacheDemoController {
    constructor($scope, $filter) {
        setInterval(()=> {
            $scope.$apply();
        }, 1000);
        this.$scope = $scope
        this.$filter = $filter;
        console.log('I am cache demo controller!!');
        // todo make simple initializer which hides following init chain. it will get simple JSON config
        var rm = new RequestManager();
        var cacheManager = new CacheManager();
        this.rm = rm;
        rm.CacheManager = cacheManager;
        cacheManager.RequestManager = rm;
        $scope.selectedAggregation = {text: '...'};
        $scope.vizWidth=vizWidth;

        rm.init(()=> {


            cacheManager.createSerieCache({serieId: 's001'});
            // cacheManager.createSerieCache({serieId: 's002'});
            // cacheManager.createSerieCache({serieId: 's003'});


            $scope.$apply(()=> {
                $scope.availableAggregations = [{id: 'raw'}].concat(rm.getManifestForSerie('s001').levels).map((level)=> {
                    var item = {
                        text: level.id,
                        name: level.id,
                        click: (val)=> {
                            $scope.selectedAggregation = item
                        }
                    };
                    return item;
                });
                $scope.availableSeries = rm.CacheManager.serieCacheSet.values.map((serieCache)=> {
                    var item = {
                        text: serieCache.options.serieId,
                        name: serieCache.options.serieId,
                        click: (val)=> {
                            $scope.selectedSerie = item
                        }
                    };
                    return item;
                });
                $scope.selectedAggregation = $scope.availableAggregations[3]
                $scope.selectedSerie = $scope.availableSeries[0];
                $scope.rangeFrom = '2016-01-01';//rm.getManifestForSerie('s001').$start;
                $scope.mouse = '2016-01-03';//rm.getManifestForSerie('s001').$start;
                $scope.rangeTo = '2016-01-02';//rm.getManifestForSerie('s001').$end;
                $scope.rm = rm;
                this.startTime = rm.getManifestForSerie('s001').start;
                this.endTime = rm.getManifestForSerie('s001').end;
                this.maxDuration = this.endTime - this.startTime;
            });

            this.initChart();

            // rm.addRequest(new DataRequest('s001', '1h', '2015-11-12', '2015-12-12', 0));
            // rm.addRequest(new DataRequest('s004', '30m', '2015-11-12', '2015-12-12', 0));
            // rm.addRequest(new DataRequest('s002', '10s', '2016-01-02 13:12', '2016-01-02 13:34', 0));
            // rm.addRequest(new DataRequest('s003', '1h', '2015-11-12', '2015-12-12', 0));
            // rm.addRequest(new DataRequest('s001', '1d', '2015-11-12', '2016-12-12', 0));
        });

        window.addRequest = function (serie, level, from, to) {
            rm.addRequest(new DataRequest(serie, level, from, to));
        };
        window.rm = rm;


    }

    initChart() {
        var container = document.getElementById('main-chart');
        var names = ['SquareShaded', 'Bargraph', 'Blank', 'CircleShaded'];
        var groups = new vis.DataSet();
        groups.add({
            id: 0,
            content: names[0],
            options: {
                drawPoints: {
                    style: 'square' // square, circle
                },
                shaded: {
                    orientation: 'bottom' // top, bottom
                }
            }
        });

        var items = [];

        var dataset = new vis.DataSet(items, {
            queue:true
        });
        var options = {
            defaultGroup: 'ungrouped',
            // legend: true,
            start: '2016-01-01 09:55',
            end: '2016-01-01 10:07',
            interpolation: false,
            height: 200
        };
        var graph2d = new vis.Graph2d(container, dataset, groups, options);
        this.graph2d = graph2d;

        var visSource = new VisSource(this.rm.CacheManager.getSerieCache('s001'), graph2d, dataset, groups);
        this.visSource = visSource;
    }

    loadRight() {
        var window = this.graph2d.getWindow();
        var length = window.end - window.start;
        window.start = window.start.getTime() + length;
        window.end = window.end.getTime() + length;
        this.graph2d.setWindow(window);
    }

    loadLeft() {
        var window = this.graph2d.getWindow();
        var length = window.end - window.start;
        window.start = window.start.getTime() - length;
        window.end = window.end.getTime() - length;
        this.graph2d.setWindow(window);
    }

    setViewportRange(start, end) {
        this.graph2d.setWindow(start, end);
    }

    getViewportRange() {
        if (this.graph2d == null || this.graph2d.getWindow() == null || isNaN(this.graph2d.getWindow().start.getTime())|| isNaN(this.graph2d.getWindow().end.getTime())) {
            return {start: 0, end: 0};
        }
        return {start: this.graph2d.getWindow().start.getTime(), end: this.graph2d.getWindow().end.getTime()}
    }
    loadRange(serie, from, to, level) {
        console.log('add request', serie, from, to, level)
        // this.rm.addRequest(new DataRequest('s001', level, from, to));
        this.rm._deferredAjaxCall._arguments.push(new DataRequest(serie, level, from, to));
    }

    flush() {
        this.rm._deferredAjaxCall._timeoutCallback();
    }

    dump() {
        //noop
    }

    getX(range) {
        return ((range.start || range.$t) - this.startTime) / this.maxDuration * vizWidth;
    }

    getWidth(range) {
        var w = (range.end || range.$t) - (range.start || range.$t);
        return Math.max(1, (w) / this.maxDuration * vizWidth);
    }

    getRangeX() {
        return this.getX({
            start: new Date(this.$scope.rangeFrom).getTime(),
            end: new Date(this.$scope.rangeTo).getTime()
        })
    }

    getRangeWidth() {
        var w = range.end - range.start;
        return Math.max(1, (w) / this.maxDuration * vizWidth);
    }

    mouse(event) {
        var x = event.offsetX;
        var time = new Date(x / vizWidth * this.maxDuration + this.startTime);
        this.$scope.mouse = time;
    }

    applyMouse(event) {
        var x = event.offsetX;
        var time = new Date(x / vizWidth * this.maxDuration + this.startTime);
        time = this.$filter('date')(time, 'yyyy-MM-dd HH:mm:ss')
        if (event.shiftKey) {
            this.$scope.rangeTo = time;
        } else {
            this.$scope.rangeFrom = time;
        }
    }

    showProjectionCacheAtLevel(levelId) {
        console.log(levelId);
        var format = require('date-format');
        var fmt = (d)=>format.asString('yy-MM-dd hh:mm:ss', new Date(d));
        console.log(this.rm.CacheManager.getSerieCache('s001').getProjectionDisposer().getProjection(levelId).projection.map((a)=>`${fmt(a.start)} ${fmt(a.end)} ${a.levelId}`).join('\n'));
    }

    showCacheAtLevel(levelId) {
        console.log(levelId);
        var format = require('date-format');
        var fmt = (d)=>format.asString('yy-MM-dd hh:mm:ss', new Date(d));
        console.log(this.rm.CacheManager.getSerieCache('s001').getLevelCache(levelId)._segmentArray._data.map((a)=>`${JSON.stringify(a)}`).join('\n'));
    }

    selectAggAndSerie(agg, serie) {
        if (typeof agg != 'string') {
            agg = agg.level.id;
        }
        this.$scope.selectedAggregation = this.$scope.availableAggregations.find((a)=>a.name == agg);
        this.$scope.selectedSerie = this.$scope.availableSeries.find((a)=>a.name == serie.options.serieId);
    }
}