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
        var projectionAtLevelIndex = this.cacheLevelIds.indexOf(levelId);
        for (var i = projectionAtLevelIndex; i < this.projections.length; i++) {
            this.projections[i].recompile(levelId, rangeSet);
        }
    }

    getProjection(levelId) {
        return this.projections[this.cacheLevelIds.indexOf(levelId)];
    }


}
import CacheProjection from "./CacheProjection";
export class Builder {
    constructor() {
        this.levelIds = [];
    }

    withLevelIds(levelIds) {
        this.levelIds = levelIds;
        return this;
    }

    build() {
        var projections = this.levelIds.map((id, i)=>new CacheProjection().setup(id, this.levelIds.slice(i)));
        return new SerieCacheProjectionDisposer(projections);
    }
}