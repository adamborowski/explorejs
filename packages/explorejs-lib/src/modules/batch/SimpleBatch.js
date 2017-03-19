import DeferredAction from '../../utils/DeferredAction';

/**
 * Simply adds request to the time buffer, fires at once. No merge of requests, possible redundancy&overlapping of ranges
 */
export default class SimpleBatch {
    /**
     * @param {function(DataRequest[])} callback  parameter with
     */
    constructor(callback) {
        this._deferredAjaxCall = new DeferredAction(callback, 100);
    }

    addRequest(request) {
        this._deferredAjaxCall.invoke(request);
    }

    requestsLoaded(requests) {
        // noop, this is very simple batch, no reusing ranges being loaded at the moment
    }
}
