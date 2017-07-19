/**
 * Creates and configures explorejs to not use SerieCache but instead put data directly to data source
 * @param config
 */
import RequestManager from '../../modules/RequestManager';
import BasicViewportModel from '../../prediction/BasicViewportModel';
import MockDataSource from './no--cache/MockDataSource';
import DataRequest from '../../data/DataRequest';
import StatsCollection from '../../stats/StatsCollection';

/**
 *
 * @param props
 * @returns {*}
 */
export default async (props, preset) => {

    const {manifest, batch} = props;

    const requestManager = new RequestManager(manifest, batch, 0, false);

    requestManager.stats = StatsCollection();

    const __performBatchRequest = requestManager._performBatchRequest.bind(requestManager);
    let lastXhr = null;

    requestManager.batch._deferredAjaxCall._callback = (requests) => {
        if (lastXhr) {
            lastXhr.abort();
        }
        lastXhr = __performBatchRequest([requests[requests.length - 1]]); // only last request is valid in our case
    };

    await requestManager.ready();

    const dataSourcesForSeries = {};

    // make no-cache and cut-off for higher levels (as in rasters)


    requestManager.CacheManager = {
        putData(data) {
            for (const response of data) {
                for (const ds of dataSourcesForSeries[response.serieId]) {
                    console.log(response)
                    ds.mockNewData(response);
                }
            }
        },
        createSerieCache(options) {
            dataSourcesForSeries[options.serieId] = [];
        },
        getSerieCache(serieId) {

            return {
                getSerieManifest: () => requestManager.getManifestForSerie(serieId),
                getLevelCache: levelId => ({
                    requestDataForRange(range, priority) {
                        requestManager.addRequest(new DataRequest(serieId, levelId, range.left, range.right, priority));
                    }
                })

            };
        }

    };

    return {
        createDataSource(serieId) {
            const dataSource = new MockDataSource(requestManager.CacheManager.getSerieCache(serieId));

            dataSourcesForSeries[serieId].push(dataSource);

            dataSource.predictionEngine.addModels([new BasicViewportModel(0, 0)]);
            return dataSource;
        },
        createSerieCache(serieId) {
            requestManager.CacheManager.createSerieCache({serieId});
        },
        getSerieCache() {

        },
        destroy() {
            requestManager.destroy();
        },
        setThrottle(kbps) {
            requestManager.setThrottle(kbps);
        },
        getStats() {
            return {requestManager: requestManager.stats.getEntries()};
        }
    };
};
