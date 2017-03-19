export default class SerieCacheProjectionDisposer {
    /**
     * Creates the disposer
     * @param {CacheProjection[]} cacheProjections array of CacheProjection responsible for recompiling the view on given projection level
     */
    constructor(cacheProjections) {
        this.projections = cacheProjections;
        this.cacheLevelIds = cacheProjections.map(c=>c.levelId);
    }

    /**
     * Calls recompile only on projections considering given level
     * @param levelId
     * @param rangeSet
     */
    recompile(levelId, rangeSet) {
        const projectionAtLevelIndex = this.cacheLevelIds.indexOf(levelId);

        if (projectionAtLevelIndex === -1) {
            throw new RangeError(`SerieCacheProjectionDisposer::recompile level ${levelId} not supported.`);
        }
        const result = [];

        for (let i = 0; i <= projectionAtLevelIndex; i++) {
            const projection = this.projections[i];
            const diff = projection.recompile(levelId, rangeSet);

            result.push({levelId: projection.levelId, diff});
        }
        return result;
    }

    /**
     *
     * @param levelId
     * @return {CacheProjection}
     */
    getProjection(levelId) {
        return this.projections[this.cacheLevelIds.indexOf(levelId)];
    }

}
import CacheProjection from './CacheProjection';
export class Builder {
    constructor() {
        this.levelIds = [];
    }

    /**
     * @param levelIds
     * @return {Builder}
     */
    withLevelIds(levelIds) {
        this.levelIds = levelIds;
        return this;
    }

    /**
     * @return {SerieCacheProjectionDisposer}
     */
    build() {
        const projections = this.levelIds.map((id, i) => new CacheProjection().setup(id, this.levelIds.slice(i)));

        return new SerieCacheProjectionDisposer(projections);
    }
}
