var Aggregator = require('./Aggregator');
var SerieService = require('./SerieService');
var IndexedList = require('explorejs-common/src/IndexedList');
var StatusError = require('../utils/StatusError');
module.exports = class Service {
    constructor(series) {
        this.series = series;
        this.levels = [
            {id: 'raw', 'step': 1000},
            {id: '10s', 'step': 10000},
            {id: '30s', 'step': 30000},
            {id: '1m', 'step': 60000},
            {id: '5m', 'step': 300000},
            {id: '10m', 'step': 600000},
            {id: '30m', 'step': 1800000},
            {id: '1h', 'step': 3600000},
            {id: '6h', 'step': 21600000},
            {id: '12h', 'step': 43200000},
            {id: '1d', 'step': 86400000},
            {id: '6d', 'step': 518400000},
            {id: '30d', 'step': 2592000000},
            {id: '60d', 'step': 5184000000},
            {id: '120d', 'step': 10370000000}
        ];

        this.serieServices = new IndexedList();

        for (var serie of this.series) {
            var aggregators = this.levels.filter((a)=>a.id != 'raw').map((level)=> new Aggregator(level.id, level.step));
            for (var point of serie.serieData) {
                for (var aggregator of aggregators) {
                    aggregator.Consume(point.$t, point.v);
                }
            }
            for (var aggregator of aggregators) {
                aggregator.Finish();
            }

            this.serieServices.add(serie.serieId, new SerieService(serie.serieId, serie.serieData, aggregators));
        }
    }

    getSerieService(serieId) {
        if (this.serieServices.contains(serieId)) {
            return this.serieServices.get(serieId);
        }
        throw new StatusError(404, `No service for serie: ${serieId}`);
    }
};