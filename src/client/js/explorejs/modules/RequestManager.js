import DataRequest from '../data/DataRequest';
export default class RequestManager {

    registerSerieCache(SerieCache){
        // todo
    }
    /**
     *
     * @param request {DataRequest}
     */
    addRequest(request) {
        // TODO implement batching. At the moment we don't fire every ajax call per request
        this._processBatchRequest(request);
    }

    increasePriority(request) {
        // TODO implement reprioritizing when implementing deferred request batching
        // noop
    }

    /**
     *
     * @param request{DataRequest}
     * @private
     */
    _processBatchRequest(request) {
        // TODO implement deferred request batching, at the moment just call ajax
        // TODO remove parameter as it will pick request from queue for batching
        var data = {series: [request.toServerFormat()]};
        var xhr = new XMLHttpRequest();
        xhr.open("POST", "/api/batch", true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = ()=> {
            if (xhr.status === 200) {
                var resp = JSON.parse(xhr.responseText);
                this._processBatchResponse(resp);
            }
            else {
                console.error('error');
            }
        };
        xhr.send(JSON.stringify(data));
    }

    _processBatchResponse(response) {
        for (var serieResponse of response.series) {
            var serieData = DataRequest.fromServerFormat(serieResponse);
            console.log(`got data for ${serieData.serieId} level = ${serieData.level} <${serieData.openTime};${serieData.closeTime}: ${serieResponse.data.length})`)
            // todo add propagation to serieCache
        }
    }
}