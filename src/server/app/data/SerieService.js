var bs = require('binarysearch');
var IndexedList = require('explorejs-common/src/IndexedList');
module.exports = class SerieService {
    constructor(serieId, data, aggregators) {
        this.serieId = serieId;
        this.rawData = data;
        this.aggregators = IndexedList.fromArray(aggregators, 'levelId');
    }

    getRange(levelId, openTime, closeTime) {
        var data;
        if (levelId == 'raw') {
            data = this.rawData;
        } else {
            if (this.aggregators.contains(levelId)) {
                data = this.aggregators.get(levelId).aggregatedData;
            }
            else {
                throw new Error(`Cannot find aggregation for level ${levelId}.`);
            }
        }
        var openTimeGreaterThanCmp, closeTimeGreaterThanCmp;
        var isRaw = levelId == 'raw';
        if (isRaw) {
            openTimeGreaterThanCmp = closeTimeGreaterThanCmp = (v, find)=>v.$t - find;
        }
        else {
            openTimeGreaterThanCmp = (v, find)=>v.$e - find;
            closeTimeGreaterThanCmp = (v, find)=>v.$s - find;
        }
        var firstIndex = bs.closest(data, openTime, openTimeGreaterThanCmp);
        var lastIndex = bs.closest(data, closeTime, closeTimeGreaterThanCmp);


        if (isRaw) {
            // edge case 1: first point.$t < openTime
            if (data[firstIndex].$t < openTime) {
                firstIndex++;
            }
            // edge case 2: last point.open >=  closeTime
            if (data[lastIndex].$t >= closeTime) {
                lastIndex--;
            }
        }
        else {
            // edge case 1: first point.closeTime <= openTime
            if (data[firstIndex].$e <= openTime) {
                firstIndex++;
            }
            // edge case 2: last point.openTime >= closeTime
            if (data[lastIndex].$s >= closeTime) {
                lastIndex--;
            }
        }
        return data.slice(firstIndex, lastIndex + 1);
    }

    getStartTime() {
        return this.rawData[0].$t;
    }

    getEndTime() {
        return this.rawData[this.rawData.length - 1].$t;
    }
};