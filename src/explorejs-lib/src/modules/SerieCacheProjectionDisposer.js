export default class SerieCacheProjectionDisposer {
    /**
     * Creates the disposer
     * @param {CacheProjection[]} cacheProjections array of CacheProjection responsible for recompiling the view on given projection level
     */
    constructor(cacheProjections) {
        this.projections = cacheProjections;
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