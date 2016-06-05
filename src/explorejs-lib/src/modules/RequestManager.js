import DataRequest from '../data/DataRequest';
import DeferredAction from "../utils/DeferredAction";
import IndexedList from 'explorejs-common/src/IndexedList';
/**
 * @property {CacheManager} CacheManager
 */
export default class RequestManager {

    constructor() {
        this._deferredAjaxCall = new DeferredAction(this._performBatchRequest.bind(this), 0);
    }

    /**
     *
     * @param request {DataRequest}
     */
    addRequest(request) {
        this._deferredAjaxCall.invoke(request);
    }

    increasePriority(request) {
        // TODO implement reprioritizing when implementing deferred request batching
        // noop
    }

    /**
     * calls server for manifest
     */
    init(callback) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", "/api/manifest", true);
        xhr.onload = ()=> {
            if (xhr.status === 200) {
                var manifest = JSON.parse(xhr.responseText);
                this._serverManifest = IndexedList.fromArray(manifest.series, 'serieId');
                callback();
            }
            else {
                console.error(`RequestManager error during getting manifest`);
            }
        };
        xhr.send();
    }

    /**
     *
     * @param requests{DataRequest[]}
     * @private
     */
    _performBatchRequest(requests) {
        var data = {series: requests.map((request)=>request.toServerFormat())};
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

        for (var error of response.errors) {
            console.error(`RequestManager error #${error.code} "${error.message}"`);
        }

        var data = response.series
            .filter((serie)=> {
                if (serie.error) {
                    console.error(`RequestManager error for serie ${serie.id} ${serie.error.status}: ${serie.error.message}`);
                }
                return serie.error == null;
            })
            .map((serie)=> {
                var serieConfig = DataRequest.fromServerFormat(serie);
                serieConfig.data = serie.data;
                return serieConfig;
            });

        this.CacheManager.putData(data);
    }

    getManifestForSerie(serieId) {
        if (this._serverManifest == null) {
            throw new Error(`RequestManager error: server manifest not initialized`);
        }
        if (this._serverManifest.contains(serieId)) {
            return this._serverManifest.get(serieId);
        }
        throw new Error(`RequestManager error: manifest doesn't contain serie ${serieId}`);
    }

    getServerManifest() {
        if (this._serverManifest == null) {
            throw new Error(`RequestManager error: server manifest not initialized`);
        }
        return this._serverManifest;
    }
}