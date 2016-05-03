/**
 * TODO consider one cacheProjection per CacheLevel - without ranges
 * then if you have datasource - it will bind a range onto cacheprojection
 *
 * Cache projection
 * Calculates diffs in meaning of rendering effect (how user sees that)
 *
 * compile levels to call renderer.
 *
 * - listens to events of specified LevelCaches on specified Range
 * @property {SerieCache} SerieCache
 */
export default class CacheProjection {
    setup() {
        this._onRangeDataPut = this._onRangeDataPut.bind(this);
        this.observedLevelCaches = [];
    }

    _onRangeDataPut(data) {
        for (var levelCache of this.observedLevelCaches) {
            levelCache.events.removeListener('data', this._onRangeDataPut);
        }
    }


}