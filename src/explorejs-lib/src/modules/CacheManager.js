import DataRequest from '../data/DataRequest';
import IndexedList from 'explorejs-common/src/IndexedList';
import SerieCache from "./SerieCache";
/**
 * @property {RequestManager} RequestManager
 */
export default class CacheManager {


    constructor() {
        this.serieCacheSet = new IndexedList();
    }


    /**
     *
     * @param options.serieId the id of serie
     * @constructor
     */
    createSerieCache(options) {
        var serieCache = new SerieCache(options);
        serieCache.CacheManager = this;
        serieCache.setup();
        this.serieCacheSet.add(options.serieId, serieCache);
    }

    /**
     * @param serieId
     * @return SerieCache
     */
    getSerieCache(serieId) {
        return this.serieCacheSet.get(serieId);
    }

    /**
     *
     * @param series {Array<Object>}
     * @param series[].serieId
     * @param series[].level
     * @param series[].openTime
     * @param series[].closeTime
     * @param series[].data
     */
    putData(series) {
        for (var serieResponse of series) {
            this.getSerieCache(serieResponse.serieId).putDataAtLevel(serieResponse.level, serieResponse.data)
        }
    }
}