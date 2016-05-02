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

    /**
     * bind range events to levels based on scale-to-discreete fit.
     * tasks:
     * 1. remove all items being out of projection
     * 2. create all items for new projection
     * 3. rebind events to new levels and new ranges
     * @param scale
     * @param from
     * @param to
     */

    changeProjection(scale, from, to) {

    }


}