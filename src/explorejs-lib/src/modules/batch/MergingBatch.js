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
    constructor(callback, delay = 100) {
        this.callback = callback;
        this.queuedRanges = this.createRangeQueue();
        this.pendingRanges = this.createRangeQueue();
        this.deferredAction = new DeferredAction(this._delayedPerformRequest.bind(this), delay);
    }

    createRangeQueue() {
        return new FactoryDictionary((serieId)=>new FactoryDictionary((levelId)=>({
            serieId,
            levelId,
            ranges: []
        })));
    }

    /**
     * @param request {DataRequest}
     */
    addRequest(request) {
        const pendingRanges = this.pendingRanges.get(request.serieId).get(request.level);
        const queuedRanges = this.queuedRanges.get(request.serieId).get(request.level);
        var requestedRange = {start: request.openTime, end: request.closeTime};

        var requestedButNotPendingRanges = DiffRangeSet.subtract([requestedRange], pendingRanges.ranges).result;

        queuedRanges.ranges = DiffRangeSet.add(queuedRanges.ranges, requestedButNotPendingRanges).result;
        this.deferredAction.invoke();
    }

    _delayedPerformRequest() {
        console.time('delayed perform')
        const queuedRangeSets = this.getRangeSet(this.queuedRanges);
        var requests = _.flatten(queuedRangeSets.map(set=>set.ranges.map(r =>new DataRequest(set.serieId, set.levelId, r.start, r.end))));

        // add all queued ranges to pending ranges, clear queued ranges
        for (var queuedRangeSet of queuedRangeSets) {
            var pendingSet = this.pendingRanges.get(queuedRangeSet.serieId).get(queuedRangeSet.levelId);
            pendingSet.ranges = DiffRangeSet.add(pendingSet.ranges, queuedRangeSet.ranges).result;
        }
        this.queuedRanges.clear();

        console.timeEnd('delayed perform')

        this.callback(requests);
    }

    getRangeSet(queue) {
        var arr = [];
        for (var a of queue.getValues()) {
            for (var b of a.getValues()) {
                arr.push(b);
            }
        }
        return arr;
    }


    /**
     *
     * @param requests {DataRequest[]}
     */
    requestsLoaded(requests) {
        console.time('requests loaded')
        // remove ranges from given requests from pending requests
        for (var request of requests) {
            var pendingRangeSet = this.pendingRanges.get(request.serieId).get(request.level);
            pendingRangeSet.ranges = DiffRangeSet.subtract(pendingRangeSet.ranges, [{
                start: request.openTime,
                end: request.closeTime
            }]).result;
        }
        console.timeEnd('requests loaded')
    }
}