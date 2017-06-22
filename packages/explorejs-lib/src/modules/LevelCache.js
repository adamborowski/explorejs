import {OrderedSegmentArray} from 'explorejs-common';
import DataRequest from '../data/DataRequest';
import xspans from 'xspans';
/**
 * @property {SerieCache} SerieCache
 */
export default class LevelCache {
    constructor(level) {
        this.level = level;
        this._dataIndex;
    }

    setup() {
        this._leftBoundKey = this.level.id === 'raw' ? '$t' : '$s';
        this._rightBoundKey = this.level.id === 'raw' ? '$t' : '$e';
        this._segmentArray = new OrderedSegmentArray({
            leftBoundClosed: true,
            rightBoundClosed: false,
            leftBoundKey: this._leftBoundKey,
            rightBoundKey: this._rightBoundKey
        });
        this._dataIndex = xspans();
    }

    /**
     *
     * @param {Range} range
     */
    getRange(range, oneMore = false) {
        return this._segmentArray.getRange2(range, oneMore);
    }

    putData(data) {
        // this.events.fireEvent('data', this._segmentArray._)
        if (data.length === 0) {
            // console.log(`LevelCache: put data of serie ${this.SerieCache.options.serieId} ${this.level.id} \n\t(no data) = ${data.length}`);
        } else {
            this._segmentArray.mergeRange(data);
            this._dataIndex.union([{
                start: data[0][this._leftBoundKey],
                end: data[data.length - 1][this._rightBoundKey]
            }]);
            // <debug>
            /* eslint-disable */
            this._debug_data_index = this._dataIndex.toObjects('start', 'end');
            // </debug>
            // if (data[0].$ss != null) {
            //     console.log(`LevelCache: put data of serie ${this.SerieCache.options.serieId} ${this.level.id}
            // \n\t(${data[0].$ss},${data[data.length - 1].$ee}) = ${data.length}`);
            // }
        }
    }

    /**
     *
     * @param {Range} range
     * @param {number} [priority]
     * @return {Array} actual ranges requested to the server
     */
    requestDataForRange(range, priority) {
        if (priority == null) {
            priority = 0;
        }
        var requestManager = this.SerieCache.CacheManager.RequestManager;
        var serieId = this.SerieCache.options.serieId;
        // compute which data should we ask the server
        var neededRanges = xspans.sub([{
            start: range.left,
            end: range.right
        }], this._dataIndex).toObjects('start', 'end');
        // todo upewnic sie ze jak wraca data z serwera, nalezy sprawdzic, czy nie zmergowac cacheprojection

        for (var range of neededRanges) {
            requestManager.addRequest(new DataRequest(serieId, this.level.id, range.start, range.end, priority));
        }
        return neededRanges;
    }
}
