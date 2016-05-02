import OrderedSegmentArray from 'explorejs-common/src/OrderedSegmentArray';
/**
 * @property {SerieCache} SerieCache
 */
export default class LevelCache {
    constructor(level) {
        this.level = level;
    }

    setup() {
        this._segmentArray = new OrderedSegmentArray({
            leftBoundClosed: true,
            rightBoundClosed: false,
            leftBoundKey: this.level.id == 'raw' ? '$t' : '$s',
            rightBoundKey: this.level.id == 'raw' ? '$t' : '$e'
        });
    }

    putData(data) {
        this._segmentArray.mergeRange(data);
        // todo fire range-scoped events
        console.log(`LevelCache: put data of serie ${this.SerieCache.options.serieId} ${this.level.id} = ${data.length}`);
    }
}