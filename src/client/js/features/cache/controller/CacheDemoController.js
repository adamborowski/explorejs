import RequestManager from 'explorejs/src/modules/RequestManager';
import DataRequest from 'explorejs/src/data/DataRequest';
import CacheManager from "explorejs/src/modules/CacheManager";
import vis from "vis/dist/vis.js";
import VisSource from "explorejs/src/datasource/VisJSSource";
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

        rm.init(()=> {


            cacheManager.createSerieCache({serieId: 's001'});
            cacheManager.createSerieCache({serieId: 's002'});
            cacheManager.createSerieCache({serieId: 's003'});


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
                $scope.rangeFrom = '2016-03-03';//rm.getManifestForSerie('s001').$start;
                $scope.mouse = '2016-03-03';//rm.getManifestForSerie('s001').$start;
                $scope.rangeTo = '2016-04-01';//rm.getManifestForSerie('s001').$end;
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

        groups.add({
            id: 1,
            content: names[1],
            options: {
                style: 'bar'
            }
        });

        groups.add({
            id: 2,
            content: names[2],
            options: {drawPoints: false}
        });

        groups.add({
            id: 3,
            content: names[3],
            options: {
                drawPoints: {
                    style: 'circle' // square, circle
                },
                shaded: {
                    orientation: 'top' // top, bottom
                }
            }
        });

        var items = [];

        var dataset = new vis.DataSet(items);
        var options = {
            defaultGroup: 'ungrouped',
            // legend: true,
            start: this.startTime,
            end: this.endTime,
            interpolation: false
        };
        var graph2d = new vis.Graph2d(container, dataset, groups, options);

        var visSource = new VisSource(this.rm.CacheManager.getSerieCache('s001'), graph2d, dataset, groups);
        this.visSource = visSource;
    }

    //noinspection JSUnusedGlobalSymbols
    testArrayPerformanceAsTimeSeriesBackend() {
        console.time('creation test')
        var array = new Array;
        for (var i = 0; i < 10000; i++) {
            array.push(i);
        }
        var array2 = new Array;
        for (var j = 0; j < 3000; j++) {
            array2.push(j);
        }
        console.timeEnd('creation test')

        console.log(array.length);

        console.time('remove test')
        array.splice(4000, 2000);
        console.timeEnd('remove test');
        console.log(array.length);
        console.time('concat test');
        var argus = [4000, 0].concat(array2);
        console.timeEnd('concat test');
        console.time('insert test')
        array.splice(...argus);
        console.timeEnd('insert test');
        console.log(array.length);

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
        return ((range.start || range.$t) - this.startTime) / this.maxDuration * 960;
    }

    getWidth(range) {
        var w = (range.end || range.$t) - (range.start || range.$t);
        return Math.max(1, (w) / this.maxDuration * 960);
    }

    getRangeX() {
        return this.getX({
            start: new Date(this.$scope.rangeFrom).getTime(),
            end: new Date(this.$scope.rangeTo).getTime()
        })
    }

    getRangeWidth() {
        var w = range.end - range.start;
        return Math.max(1, (w) / this.maxDuration * 960);
    }

    mouse(event) {
        var x = event.offsetX;
        var time = new Date(x / 960 * this.maxDuration + this.startTime);
        this.$scope.mouse = time;
    }

    applyMouse(event) {
        var x = event.offsetX;
        var time = new Date(x / 960 * this.maxDuration + this.startTime);
        time = this.$filter('date')(time, 'yyyy-MM-dd HH:mm:ss')
        if (event.shiftKey) {
            this.$scope.rangeTo = time;
        } else {
            this.$scope.rangeFrom = time;
        }
    }

    selectAggAndSerie(agg, serie) {
        if (typeof agg != 'string') {
            agg = agg.level.id;
        }
        this.$scope.selectedAggregation = this.$scope.availableAggregations.find((a)=>a.name == agg);
        this.$scope.selectedSerie = this.$scope.availableSeries.find((a)=>a.name == serie.options.serieId);
    }
}