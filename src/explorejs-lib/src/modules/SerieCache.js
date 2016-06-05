import LevelCache from "./LevelCache";
import CacheProjection from "./CacheProjection";
import IndexedList from "explorejs-common/src/IndexedList";
/**
 * @property {CacheManager} CacheManager
 */
export default class SerieCache {

    /**
     * @param options.serieId the id of serie
     */
    constructor(options) {
        this.options = options;
    }

    setup() {
        var manifest = this.CacheManager.RequestManager.getManifestForSerie(this.options.serieId);
        var levels = manifest.levels;
        this._levelCacheSet = new IndexedList();
        this._levelProjectionSet = new IndexedList();

        for (var level of [{id: 'raw'}].concat(levels)) {
            var levelCache = new LevelCache(level);
            var levelProjection = new CacheProjection(level);
            levelCache.SerieCache = this;
            levelProjection.SerieCache = this;
            this._levelCacheSet.add(level.id, levelCache);
            this._levelProjectionSet.add(level.id, levelProjection);
            levelCache.setup();
            levelProjection.setup();
        }

    }

    /**
     * @param level the level of cache, e.g. 30s
     * @param data
     */
    putDataAtLevel(level, data) {
        this._levelCacheSet.get(level).putData(data);
    }
}