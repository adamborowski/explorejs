export default class DataUtil {
    static boundGetter(levelId) {
        if (levelId == 'raw') {
            return DataUtil.rawBoundGetter;
        }
        return DataUtil.aggregatedBoundGetter;

    }

    static getStartOfRawDataPoint(point) {
        return point.$t;
    }

    static getEndOfRawDataPoint(point) {
        return point.$t;
    }

    static getStartOfAggregatedDataPoint(point) {
        return point.$s;
    }

    static getEndOfAggregatedDataPoint(point) {
        return point.$e;
    }
}

DataUtil.rawBoundGetter = {
    start: DataUtil.getStartOfRawDataPoint,
    end: DataUtil.getEndOfRawDataPoint,
    bounds: (point)=>({start: DataUtil.getStartOfRawDataPoint(point), end: DataUtil.getEndOfRawDataPoint(point)})
};
DataUtil.aggregatedBoundGetter = {
    start: DataUtil.getStartOfAggregatedDataPoint,
    end: DataUtil.getEndOfAggregatedDataPoint,
    bounds: (point)=>({
        start: DataUtil.getStartOfAggregatedDataPoint(point),
        end: DataUtil.getEndOfAggregatedDataPoint(point)
    })
};
