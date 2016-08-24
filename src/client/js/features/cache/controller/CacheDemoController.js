import RequestManager from 'explorejs/src/modules/RequestManager';
import DataRequest from 'explorejs/src/data/DataRequest';
import CacheManager from "explorejs/src/modules/CacheManager";
import FlotAdapter from "explorejs/src/adapter/FlotAdapter";
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
        $scope.vizWidth = vizWidth;

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

        var $ = require('jquery');
        window.jQuery = $; // hack :(
        var Flot = require('jquery-flot');
        require('jquery-flot/jquery.flot.time');
        require('jquery-flot/jquery.flot.fillbetween');
        require('jquery-flot/jquery.flot.navigate');

        //

        /**
         * Flot plugin for adding additional auto scalling modes.
         *
         * @author Joel Oughton
         */
        (function ($) {
            function init(plot) {

                plot.autoScale = function () {
                    var opts = plot.getYAxes()[0].options;
                    var data = plot.getData();

                    var xaxis = plot.getAxes().xaxis;
                    const maxRed = (acc, val)=>Math.max(acc, val[1]);
                    const minRed = (acc, val)=>Math.min(acc, val[1]);
                    if (data.length == 3) {
                        const boundFilter = data=>data[1] != null && !isNaN(data[1]) && data[0] >= xaxis.options.min && data[0] <= xaxis.options.max;
                        var max = data[0].data.filter(boundFilter).reduce(maxRed, Number.NEGATIVE_INFINITY);
                        var min = data[1].data.filter(boundFilter).reduce(minRed, Number.POSITIVE_INFINITY);

                        var margin = Math.abs(max - min) * opts.autoscaleMargin;

                        opts.min = min - margin;
                        opts.max = max + margin;
                    }


                    // plot.setupGrid();
                    // plot.draw();

                    return {
                        min: opts.min,
                        max: opts.max
                    };
                }
            }

            $.plot.plugins.push({
                init: init,
                name: "autoscalemode",
                version: "0.6"
            });
        })(jQuery);


        //

        const chart = $('#main-chart');
        this.adapter = new FlotAdapter(this.rm.CacheManager.getSerieCache('s001'), chart, Flot, $, (length)=> {
            this.$scope.$apply(()=> {
                this.$scope.numPoints = length;
            });
        });

        this.adapter.setDisplayedRange(new Date('2012-01-01').getTime(), new Date('2018-01-01').getTime());
    }

    getWindow() {
        return this.adapter.getDisplayedRange();
    }

    loadRight() {
        var window = this.getWindow();
        var length = window.end - window.start;
        this.adapter.setDisplayedRange(window.start + length / 2, window.end + length / 2)
    }

    loadLeft() {
        var window = this.getWindow();
        var length = window.end - window.start;
        this.adapter.setDisplayedRange(window.start - length / 2, window.end - length / 2)
    }

    zoom(step) {
        var window = this.getWindow();
        var start = window.start;
        var end = window.end;
        var middle = (end + start) / 2;
        var length = end - start;
        var addition = length * step;
        this.adapter.setDisplayedRange(middle - addition / 2, middle + addition / 2);
    }

    setViewportRange(start, end) {
        this.adapter.setDisplayedRange(new Date(start).getTime(), new Date(end).getTime()
        );
    }

    getViewportRange() {
        if (this.adapter == null) {
            return {start: 0, end: 0};
        }
        return this.adapter.getDisplayedRange();
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
        console.log('level cache')
        console.table(this.rm.CacheManager.getSerieCache('s001').getLevelCache(levelId)._segmentArray._data);
        console.log('wrappers')
        console.table(this.adapter.dataSource.wrapperCache.wrappers);
    }

    selectAggAndSerie(agg, serie) {
        if (typeof agg != 'string') {
            agg = agg.level.id;
        }
        this.$scope.selectedAggregation = this.$scope.availableAggregations.find((a)=>a.name == agg);
        this.$scope.selectedSerie = this.$scope.availableSeries.find((a)=>a.name == serie.options.serieId);
    }
}