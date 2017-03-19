import LevelCache from './LevelCache';
import IndexedList from 'explorejs-common/src/IndexedList';
import {Builder} from './SerieCacheProjectionDisposer';
import RangeScopedEvent from 'explorejs-common/src/RangeScopedEvent';
import Range from 'explorejs-common/src/Range';

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
        const manifest = this._serieManifest = this.CacheManager.RequestManager.getManifestForSerie(this.options.serieId);
        const levels = manifest.levels;

        this._levelCacheSet = new IndexedList();
        this._levelProjectionEventSet = new IndexedList();

        const allLevels = [{id: 'raw', step: 0}].concat(levels).sort((a, b) => a.step - b.step);

        this._disposer = new Builder().withLevelIds(allLevels.map(a=>a.id)).build();
        for (let level of allLevels) {
            const levelCache = new LevelCache(level);

            levelCache.SerieCache = this;
            this._levelCacheSet.add(level.id, levelCache);
            this._levelProjectionEventSet.add(level.id, new RangeScopedEvent());
            levelCache.setup();
        }

    }

    /**
     * @param levelId the level id of cache, e.g. 30s
     * //TODO defer firing events as one request response may contain many ranges for this serie and/or level
     * @param data
     */
    putDataAtLevel(levelId, data) {
        if (data.length === 0) {
            // console.info('SerieCache, no data put at level', levelId);
            return;
        }
        this._levelCacheSet.get(levelId).putData(data);
        const projectionDiffs = this._disposer.recompile(levelId, [this.getRangeOfData(levelId, data)]);

        for (let diff of projectionDiffs) {
            const rangeOfDiff = this._getRangeOfDiff(diff.diff);

            if (rangeOfDiff != null) {
                this._levelProjectionEventSet.get(diff.levelId).fireEvent('recompile', Range.leftClosed(rangeOfDiff.left, rangeOfDiff.right), diff.diff);
            }
        }

    }

    /**
     * @param levelId
     * @return {RangeScopedEvent}
     */
    getProjectionEventAtLevel(levelId) {
        return this._levelProjectionEventSet.get(levelId);
    }

    /**
     * @param levelId
     * @return {LevelCache}
     */
    getLevelCache(levelId) {
        return this._levelCacheSet.get(levelId);
    }

    _getRangeOfDiff(diff) {
        if (diff == null) {
            return null;
        }

        const range = {left: Infinity, right: -Infinity};

        function updateRange(array) {
            if (array.length) {
                range.left = Math.min(range.left, array[0].start);
                range.right = Math.max(range.right, array[array.length - 1].end);
            }
        }

        updateRange(diff.added);
        updateRange(diff.removed);
        updateRange(diff.resized);
        return range.left === Infinity && range.right === -Infinity ? null : range;
    }

    getRangeOfData(levelId, data) {
        if (data.length) {
            if (levelId === 'raw') {
                return {start: data[0].$t, end: data[data.length - 1].$t};
            }
            return {start: data[0].$s, end: data[data.length - 1].$e};
        }
        return null;
    }

    getSerieManifest() {
        return this._serieManifest;
    }

    /**
     * @return {SerieCacheProjectionDisposer}
     */
    getProjectionDisposer() {
        return this._disposer;
    }
}
