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
        var openTimeCmp, closeTimeCmp;
        if (levelId == 'raw') {
            openTimeCmp = closeTimeCmp = (v, find)=>v.$t - find;
        }
        else {
            openTimeCmp = (v, find)=>v.$e - find;
            closeTimeCmp = (v, find)=>v.$s - find;
        }
        var firstIncludedCloseIndex = bs.closest(aggregator, openTime, openTimeCmp);
        var lastIncludedOpenIndex = bs.closest(aggregator, closeTime, closeTimeCmp);
        //todo edge cases check
        return aggregator.slice(firstIncludedCloseIndex, lastIncludedOpenIndex + 1);
    }
};