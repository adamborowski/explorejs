import {FactoryDictionary, DiffRangeSet} from 'explorejs-common';
import DeferredAction from '../../utils/DeferredAction';
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
        return new FactoryDictionary((serieId) => new FactoryDictionary((levelId) => ({
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
        const requestedRange = {start: request.openTime, end: request.closeTime};

        const requestedButNotPendingRanges = DiffRangeSet.subtract([requestedRange], pendingRanges.ranges).result;

        queuedRanges.ranges = DiffRangeSet.add(queuedRanges.ranges, requestedButNotPendingRanges).result;
        this.deferredAction.invoke();
    }

    _delayedPerformRequest() {
        const queuedRangeSets = this.getRangeSet(this.queuedRanges);
        const requests = _.flatten(queuedRangeSets.map(set => set.ranges.map(r => new DataRequest(set.serieId, set.levelId, r.start, r.end))));

        // add all queued ranges to pending ranges, clear queued ranges
        for (let queuedRangeSet of queuedRangeSets) {
            const pendingSet = this.pendingRanges.get(queuedRangeSet.serieId).get(queuedRangeSet.levelId);

            pendingSet.ranges = DiffRangeSet.add(pendingSet.ranges, queuedRangeSet.ranges).result;
        }
        this.queuedRanges.clear();

        this.callback(requests);
    }

    getRangeSet(queue) {
        const arr = [];

        for (let a of queue.getValues()) {
            for (let b of a.getValues()) {
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
        // remove ranges from given requests from pending requests
        for (let request of requests) {
            const pendingRangeSet = this.pendingRanges.get(request.serieId).get(request.level);

            pendingRangeSet.ranges = DiffRangeSet.subtract(pendingRangeSet.ranges, [{
                start: request.openTime,
                end: request.closeTime
            }]).result;
        }
    }
}
