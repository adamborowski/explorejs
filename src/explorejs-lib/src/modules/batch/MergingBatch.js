import FactoryDictionary from 'explorejs-common/src/FactoryDictionary';
import DeferredAction from "../../utils/DeferredAction";
import DiffRangeSet from 'explorejs-common/src/DiffRangeSet';
import DataRequest from '../../data/DataRequest';
import _ from 'underscore';
export default class MerginbBatch {
    /**
     * @param {function(DataRequest[])} callback  parameter with
     * @param delay of performing batch request
     */
    constructor(callback, delay = 150) {
        this.callback = callback;
        this.factory = new FactoryDictionary((serieId)=>new FactoryDictionary((levelId)=>({
            serieId,
            levelId,
            ranges: []
        })));
        this.deferredAction = new DeferredAction(this._delayedCallback.bind(this), delay);
    }

    /**
     * @param request {DataRequest}
     */
    addRequest(request) {
        console.trace();
        const rangesOnLevel = this.factory.get(request.serieId).get(request.level);
        rangesOnLevel.ranges = DiffRangeSet.add(rangesOnLevel.ranges, [{
            start: request.openTime,
            end: request.closeTime
        }]).result;
        this.deferredAction.invoke();
    }

    _delayedCallback() {//todo underscore flatten .map(.map(new DataReqtest))
        console.log('delayed callback')
        var requests = [];
        for (var onSerie of this.factory.getValues()) {
            for (var onLevel of onSerie.getValues()) {
                for (var range of onLevel.ranges) {
                    requests.push(new DataRequest(onLevel.serieId, onLevel.levelId, range.start, range.end));
                }
            }
        }
        this.factory.clear();
        this.callback(requests);
    }
}