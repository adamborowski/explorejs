var Aggregator = require('./Aggregator');
var SerieService = require('./SerieService');
const {IndexedList} = require('explorejs-common');
var StatusError = require('../utils/StatusError');
module.exports = class Service {
    constructor(series) {
        this.series = series;
        this.levels = [
            {id: 'raw', 'step': 1000},
            {id: '30s', 'step': 30 * 1000},
            {id: '1m', 'step': 60 * 1000},
            {id: '3m', 'step': 3 * 60 * 1000},
            {id: '10m', 'step': 10 * 60 * 1000},
            {id: '30m', 'step': 30 * 60 * 1000},
            {id: '1h', 'step': 60 * 60 * 1000},
            {id: '4h', 'step': 4 * 60 * 60 * 1000},
            {id: '8h', 'step': 8 * 60 * 60 * 1000},
            {id: '1d', 'step': 24 * 60 * 60 * 1000},
            {id: '3d', 'step': 3 * 24 * 60 * 60 * 1000},
            {id: '7d', 'step': 7 * 24 * 60 * 60 * 1000},
            {id: '30d', 'step': 30 * 24 * 60 * 60 * 1000},
            {id: '90d', 'step': 90 * 24 * 60 * 60 * 1000},
            {id: '1y', 'step': 365 * 24 * 60 * 60 * 1000}
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