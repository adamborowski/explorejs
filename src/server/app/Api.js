var AbstractApi = require('../modules/AbstractApi');
var fs = require('fs');
var path = require('path');
var Generator = require('./data/Generator');
var Service = require('./data/Service');
var Serie = require('./data/Serie');
module.exports = class Api extends AbstractApi {
    constructor(app, config) {
        super(app);
        this.config = config;
        this.dataService = new Service([
            new Serie("s001", new Generator().getData(new Date('2015-11-21'), new Date('2016-01-01'), 10000)),
            // new Serie("s002", new Generator().getData(new Date('2016-01-12'), new Date('2016-02-01'), 1000)),
            // new Serie("s003", new Generator().getData(new Date('2016-01-01'), new Date('2016-01-03'), 250))
        ]);
    }

    load() {
        this.putResource('tiles', this.getTiles);
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
        var openTime = new Date(req.params.open).getTime();//todo add parsing YYYY-mm-dd HH:ii:ss
        var closeTime = new Date(req.params.close).getTime();
        var serieService = this.dataService.serieServices[serie];
        if (serieService == null) {
            throw new Error(`Service for serie ${serie} not found`);
        }
        return serieService.getRange(level, openTime, closeTime);

    }


};