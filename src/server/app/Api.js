var AbstractApi = require('../modules/AbstractApi');
var fs = require('fs');
var path = require('path');
var Generator = require('./data/Generator');
var Service = require('./data/Service');
var Serie = require('./data/Serie');
var DateUtil = require('./utils/DateUtil');
module.exports = class Api extends AbstractApi {
    constructor(app, config) {
        super(app);
        this.config = config;
        this.dataService = new Service([
            new Serie("s001", new Generator().getData(DateUtil.fromStringDate('2015-11-21'), DateUtil.fromStringDate('2016-01-01 12:00'), 10000)),
            // new Serie("s002", new Generator().getData(new Date('2016-01-12'), DateUtil.fromStringDate('2016-02-01'), 1000)),
            // new Serie("s003", new Generator().getData(new Date('2016-01-01'), DateUtil.fromStringDate('2016-01-03'), 250))
        ]);
    }

    load() {
        this.putResource('tiles', this.getTiles);
        this.putResource('manifest', this.getManifest);
        this.putResource('test/:serie/:level/:open/:close', this.testQuery);
    }

    getTiles(req) {
        return {
            test: this.dataService.series[0].length
        };
        // todo parse batch request options, provide a response
    }

    testQuery(req) {
        var serie = req.params.serie;
        var level = req.params.level;
        var openTime = DateUtil.fromStringMillis(req.params.open);
        var closeTime = DateUtil.fromStringMillis(req.params.close);
        var serieService = this.dataService.serieServices[serie];
        if (serieService == null) {
            throw new Error(`Service for serie ${serie} not found`);
        }
        var serie = serieService.getRange(level, openTime, closeTime);
        return {
            count: serie.length,
            serie: serie
        };

    }

    getManifest() {
        return this.dataService.levels;
    }

};