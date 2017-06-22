import DataRequest from '../data/DataRequest';
import {IndexedList} from 'explorejs-common';
// import SimpleBatch from './batch/SimpleBatch';
import MergingBatch from './batch/MergingBatch';
/**
 * @property {CacheManager} CacheManager
 */
export default class RequestManager {

    constructor(apiManifestUrl = '/api/manifest', apiBatchUrl = '/api/batch', forceDelay = 0) {
        this.apiManifestUrl = apiManifestUrl;
        this.apiBatchUrl = apiBatchUrl;
        // this.batch = new SimpleBatch(this._performBatchRequest.bind(this));
        this.batch = new MergingBatch(this._performBatchRequest.bind(this));
        this.forceDelay = forceDelay;
    }

    setForceDelay(delay) {
        this.forceDelay = delay;
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
    ready() {

        if (this.initPromise) {
            return this.initPromise;
        }

        this.initPromise = new Promise((fulfill, reject) => {
            const xhr = new XMLHttpRequest();

            xhr.open('GET', this.apiManifestUrl, true);
            xhr.onload = () => {
                if (xhr.statusText === 'OK') {
                    let manifest;

                    try {
                        manifest = JSON.parse(xhr.responseText);
                    } catch (e) {
                        reject({success: false, errorMessage: e.message, error: e});
                        return;
                    }

                    this._serverManifest = IndexedList.fromArray(manifest.series, 'serieId');
                    fulfill(this);
                } else {
                    console.error('RequestManager error during getting manifest');
                    reject({success: false, errorMessage: xhr.responseText});
                }
            };
            xhr.send();
        });
        return this.initPromise;
    }

    /**
     *
     * @param requests{DataRequest[]}
     * @private
     */
    _performBatchRequest(requests) {
        if (requests.length === 0) {
            return;
        }
        const data = {series: requests.map((request) => request.toServerFormat())};
        const xhr = new XMLHttpRequest();

        xhr.open('POST', this.apiBatchUrl, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = () => {
            setTimeout(() => {
                if (xhr.status === 200) {
                    const resp = JSON.parse(xhr.responseText);

                    this._processBatchResponse(resp);
                } else {
                    console.error('error', xhr);
                }
                this.batch.requestsLoaded(requests);
            }, this.forceDelay || 0);
        };
        xhr.send(JSON.stringify(data));

    }

    _processBatchResponse(response) {

        for (let error of response.errors) {
            console.error(`RequestManager error #${error.code} "${error.message}"`);
        }

        let numPoints = 0;

        const data = response.series
            .filter((serie) => {
                if (serie.error) {
                    console.error(`RequestManager error for serie ${serie.id} ${serie.error.status}: ${serie.error.message}`);
                }
                return serie.error == null;
            })
            .map((serie) => {
                const serieConfig = DataRequest.fromServerFormat(serie);

                serieConfig.data = serie.data;
                numPoints += serie.data.length;
                return serieConfig;
            });

        console.debug(`RequestManager._processBatchResponse() -> got ${numPoints} points.`);

        this.CacheManager.putData(data);
    }

    getManifestForSerie(serieId) {
        if (this._serverManifest == null) {
            throw new Error('RequestManager error: server manifest not initialized');
        }
        if (this._serverManifest.contains(serieId)) {
            return this._serverManifest.get(serieId);
        }
        throw new Error(`RequestManager error: manifest doesn't contain serie ${serieId}`);
    }

    getServerManifest() {
        if (this._serverManifest == null) {
            throw new Error('RequestManager error: server manifest not initialized');
        }
        return this._serverManifest;
    }

    destroy() {
        console.warn('Request manager->destroy');
        // TODO unmount everything, cancel pending requests, remove event listeners from dom or not owning emitters
    }
}
