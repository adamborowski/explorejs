var AbstractApi = require('../modules/AbstractApi');
var fs = require('fs');
var path = require('path');
var Generator = require('./data/Generator');
var Service = require('./data/Service');
var Serie = require('./data/Serie');
var DateUtil = require('./utils/DateUtil');
var StatusError = require('./utils/StatusError');
module.exports = class Api extends AbstractApi {
    constructor(app, config) {
        super(app);
        this.config = config;
        this.dataService = new Service([
            new Serie("s001", new Generator().getData(DateUtil.fromStringDate('2013-01-01 10:00'), DateUtil.fromStringDate('2016-09-28 12:00'), 10000)),
            // new Serie("s002", new Generator().getData(DateUtil.fromStringDate('2016-01-01'), DateUtil.fromStringDate('2016-03-04 12:00'), 10000)),
            // new Serie("s003", new Generator().getData(DateUtil.fromStringDate('2015-01-01'), DateUtil.fromStringDate('2016-03-04 12:00'), 10000)),
        ]);
    }

    load() {
        this.putResourceAsync('post', 'batch', this.getBatch, 'text/json');
        this.putResource('manifest', this.getManifest);
        this.putResource('test/:serie/:level/:open/:close', this.testQuery);
    }

    getBatch(req, res) {
        var globalErrors = [];
        for (var serie of req.body.series) {
            try {
                serie.data = this.dataService.getSerieService(serie.id).getRange(serie.level, DateUtil.fromStringMillis(serie.from), DateUtil.fromStringMillis(serie.to));
            }
            catch (e) {
                if (e instanceof StatusError) {
                    serie.error = {status: e.status, message: e.message};
                }
                else {
                    throw e;
                }
            }
        }
        res.send({series: req.body.series, errors: globalErrors});
    }

    testQuery(req) {
        var serie = req.params.serie;
        var level = req.params.level;
        var openTime = DateUtil.fromStringMillis(req.params.open);
        var closeTime = DateUtil.fromStringMillis(req.params.close);
        var serieService = this.dataService.getSerieService(serie);
        if (serieService == null) {
            throw new Error(`Service for serie ${serie} not found`);
        }
        var serieData = serieService.getRange(level, openTime, closeTime);
        return {
            count: serieData.length,
            serie: serieData
        };

    }

    getManifest() {
        var serieManifests = [];
        for (var serieService of this.dataService.serieServices.values) {
            serieManifests.push({
                serieId: serieService.serieId,
                start: serieService.getStartTime(),
                end: serieService.getEndTime(),
                $start: DateUtil.format(serieService.getStartTime()),
                $end: DateUtil.format(serieService.getEndTime()),
                levels: serieService.aggregators.values.map((aggregator)=> {
                    return {
                        id: aggregator.levelId,
                        step: aggregator.interval
                    };
                })
            });
        }
        return {series: serieManifests};
    }
};