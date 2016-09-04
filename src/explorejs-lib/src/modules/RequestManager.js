import DataRequest from '../data/DataRequest';
import IndexedList from 'explorejs-common/src/IndexedList';
import SimpleBatch from "./batch/SimpleBatch";
import MergingBatch from "./batch/MergingBatch";
/**
 * @property {CacheManager} CacheManager
 */
export default class RequestManager {

    constructor(apiManifestUrl = "/api/manifest", apiBatchUrl = "/api/batch") {
        this.apiManifestUrl = apiManifestUrl;
        this.apiBatchUrl = apiBatchUrl;
        // this.batch = new SimpleBatch(this._performBatchRequest.bind(this));
        this.batch = new MergingBatch(this._performBatchRequest.bind(this));
    }

    /**
     *
     * @param request {DataRequest}
     * TODO merge queued requests if priority allows, instead of appending them!!!
     * TODO store active ajax range set, queued range sets, then
     * request = request - activeAjaxRanges
     * queuedRanges +=request
     */
    addRequest(request) {
        this.batch.addRequest(request);
    }

    /**
     * calls server for manifest
     */
    init(callback) {
        var xhr = new XMLHttpRequest();
        xhr.open("GET", this.apiManifestUrl, true);
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
        if (requests.length == 0) {
            return;
        }
        var data = {series: requests.map((request)=>request.toServerFormat())};
        var xhr = new XMLHttpRequest();
        xhr.open("POST", this.apiBatchUrl, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = ()=> {
            if (xhr.status === 200) {
                var resp = JSON.parse(xhr.responseText);
                this._processBatchResponse(resp);
            }
            else {
                console.error('error');
            }
            this.batch.requestsLoaded(requests);
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