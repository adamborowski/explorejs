import LevelCache from "./LevelCache";
import IndexedList from "explorejs-common/src/IndexedList";
import {Builder} from "/modules/SerieCacheProjectionDisposer";
import RangeScopedEvent from "explorejs-common/src/RangeScopedEvent";
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
        var manifest = this._serieManifest = this.CacheManager.RequestManager.getManifestForSerie(this.options.serieId);
        var levels = manifest.levels;
        this._levelCacheSet = new IndexedList();
        this._levelProjectionEventSet = new IndexedList();

        var allLevels = [{id: 'raw', step: 0}].concat(levels).sort((a, b)=>a.step - b.step);
        this._disposer = new Builder().withLevelIds(allLevels).build();
        for (var level of allLevels) {
            var levelCache = new LevelCache(level);
            levelCache.SerieCache = this;
            this._levelCacheSet.add(level.id, levelCache);
            this._levelProjectionEventSet.add(level.id, new RangeScopedEvent());
            levelCache.setup();
        }

    }

    /**
     * @param levelId the level id of cache, e.g. 30s
     * @param data
     */
    putDataAtLevel(levelId, data) {
        this._levelCacheSet.get(levelId).putData(data);
        var projectionDiffs = this._disposer.recompile(levelId, [this.getRangeOfData(data)]);
        for (var diff of projectionDiffs) {
            var rangeOfDiff = this._getRangeOfDiff(diff.result);
            if (rangeOfDiff != null) {
                this._levelProjectionEventSet.get(diff.levelId).fireEvent('recompile', rangeOfDiff, diff.result);
            }
        }

    }

    getProjectionEventAtLevel(levelId) {
        return this._levelProjectionEventSet.get(levelId);
    }

    _getRangeOfDiff(diff) {
        if (diff == null) {
            return null;
        }

        var range = {start: Infinity, end: -Infinity};

        function updateRange(array) {
            if (array.length) {
                range.start = Math.min(range.start, array[0].start);
                range.end = Math.max(range.end, array[array.length - 1].end);
            }
        }

        updateRange(diff.added);
        updateRange(diff.removed);
        updateRange(diff.resized);
        return range.start == Infinity && range.end == -Infinity ? null : range;
    }

    getRangeOfData(data) {
        return {start: data.$s, end: data.$e};
    }

    getSerieManifest() {
        return this._serieManifest;
    }
}