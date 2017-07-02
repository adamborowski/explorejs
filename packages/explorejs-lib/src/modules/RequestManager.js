import DataRequest from '../data/DataRequest';
import {IndexedList} from 'explorejs-common';
// import SimpleBatch from './batch/SimpleBatch';
import MergingBatch from './batch/MergingBatch';
import SimpleBatch from './batch/SimpleBatch';
/**
 * @property {CacheManager} CacheManager
 */
export default class RequestManager {

    constructor(apiManifestUrl = '/api/manifest', apiBatchUrl = '/api/batch', forceDelay = 0, useMerging = true) {
        this.apiManifestUrl = apiManifestUrl;
        this.apiBatchUrl = apiBatchUrl;
        // this.batch = new SimpleBatch(this._performBatchRequest.bind(this));
        this.batch = useMerging ? new MergingBatch(this._performBatchRequest.bind(this)) : new SimpleBatch(this._performBatchRequest.bind(this));
        this.forceDelay = forceDelay;
    }

    setForceDelay(delay) {
        console.warn('RequestManger.forceDelay is deprecated. Use throttle instead.');
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
        const startTime = new Date().getTime();

        if (requests.length === 0) {
            return;
        }
        const data = {series: requests.map((request) => request.toServerFormat())};
        const xhr = new XMLHttpRequest();

        xhr.open('POST', this.apiBatchUrl, true);
        xhr.setRequestHeader('Content-Type', 'application/json');
        xhr.onload = () => {

            const handleResponse = () => {
                if (xhr.status === 200) {
                    const resp = JSON.parse(xhr.responseText);

                    this._processBatchResponse(resp);
                } else {
                    console.error('error', xhr);
                }
                this.batch.requestsLoaded(requests);
            };

            if (this._throttle === null || this._throttle === undefined) {
                handleResponse();
            } else if (this._throttle > 0) {
                const response = xhr.responseText;
                const size = response.length / 1024; // in KB
                const estTime = size / this._throttle * 1000; //  in msc
                const loadTime = new Date().getTime() - startTime;
                const remTime = estTime - loadTime;

                console.info(`throttle: ${this._throttle}, size: ${size}, estTime: ${estTime}, loadTime: ${loadTime}, remTime: ${remTime}`);

                setTimeout(handleResponse, remTime);
            } else {
                console.warn('RequestManger.throttle set to 0, response won\'t be processed.');
            }

        };
        xhr.send(JSON.stringify(data));

        return xhr;

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

    setThrottle(kbps) {
        this._throttle = kbps;
    }
}
