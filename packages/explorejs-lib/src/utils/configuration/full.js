/**
 * Creates and configures explorejs to not use SerieCache but instead put data directly to data source
 * @param config
 */
import RequestManager from '../../modules/RequestManager';
import CacheManager from '../../modules/CacheManager';
import DataSource from '../../modules/DataSource';
import predictionModelFactory from '../prediction-model-factory.js';
import BasicViewportModel from '../../prediction/BasicViewportModel';
import WiderContextModel from '../../prediction/WiderContextModel';

/**
 *
 * @param props
 * @returns {*}
 */
export default async (props, preset) => {

    const {manifest, batch} = props;
    const {useMergingBatch} = preset;

    const requestManager = new RequestManager(manifest, batch, 0, useMergingBatch);
    const cacheManager = new CacheManager();

    requestManager.CacheManager = cacheManager;
    cacheManager.RequestManager = requestManager;

    await requestManager.ready();

    return {
        createDataSource(serieId) {
            const dataSource = new DataSource(cacheManager.getSerieCache(serieId));

            dataSource.predictionEngine.addModels([new BasicViewportModel(), new WiderContextModel()]);
            return dataSource;
        },
        createSerieCache(serieId) {
            return cacheManager.createSerieCache({serieId});
        },
        destroy() {
            requestManager.destroy();
        }
    };
};
