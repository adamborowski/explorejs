var bs = require('binarysearch');

module.exports = class SerieService {
    constructor(serieId, data, aggregators) {
        this.serieId = serieId;
        this.aggregators = {
            raw: data
        };
        for (var aggregator of aggregators) {
            this.aggregators[aggregator.levelId] = aggregator.aggregatedData;
        }
    }

    getRange(levelId, openTime, closeTime) {
        var aggregator = this.aggregators[levelId];
        if (aggregator == null) {
            throw new Error(`Cannot find aggregation for level ${levelId}.`);
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
        var firstIndex = bs.closest(aggregator, openTime, openTimeGreaterThanCmp);
        var lastIndex = bs.closest(aggregator, closeTime, closeTimeGreaterThanCmp);


        if (isRaw) {
            // edge case 1: first point.$t < openTime
            if (aggregator[firstIndex].$t < openTime) {
                firstIndex++;
            }
            // edge case 2: last point.open >=  closeTime
            if (aggregator[lastIndex].$t >= closeTime) {
                lastIndex--;
            }
        }
        else {
            // edge case 1: first point.closeTime <= openTime
            if (aggregator[firstIndex].$e <= openTime) {
                firstIndex++;
            }
            // edge case 2: last point.openTime >= closeTime
            if (aggregator[lastIndex].$s >= closeTime) {
                lastIndex--;
            }
        }

        //todo edge cases check
        return aggregator.slice(firstIndex, lastIndex + 1);
    }
};