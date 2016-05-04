import OrderedSegmentArray from 'explorejs-common/src/OrderedSegmentArray';
// import {RangeScopedEvent} from 'explorejs-common/src/RangeScopedEvent';
/**
 * @property {SerieCache} SerieCache
 */
export default class LevelCache {
    constructor(level) {
        this.level = level;
        // this.events = new RangeScopedEvent();
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
        // this.events.fireEvent('data', this._segmentArray._)
        // todo fire range-scoped events
        if(data.length==0){
            console.log(`LevelCache: put data of serie ${this.SerieCache.options.serieId} ${this.level.id} \n\t(no data) = ${data.length}`);
        }
        else{

        console.log(`LevelCache: put data of serie ${this.SerieCache.options.serieId} ${this.level.id} \n\t(${data[0].$ss},${data[data.length - 1].$ee}) = ${data.length}`);
        }
    }
}