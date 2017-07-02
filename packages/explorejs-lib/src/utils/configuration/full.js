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
    const {useMergingBatch, useFallback, usePrediction} = preset;

    const requestManager = new RequestManager(manifest, batch, 0, useMergingBatch);
    const cacheManager = new CacheManager();

    requestManager.CacheManager = cacheManager;
    cacheManager.RequestManager = requestManager;

    await requestManager.ready();

    return {
        createDataSource(serieId) {
            const dataSource = new DataSource(cacheManager.getSerieCache(serieId));

            if (!useFallback) {
                const __onProjectionChange = dataSource._onProjectionChange.bind(dataSource);

                dataSource.dynamicProjection._callback = (newProjectionRanges, reason) => {
                    __onProjectionChange(newProjectionRanges.filter(r => r.levelId === dataSource._viewState._currentLevelId), reason);
                };
            }

            if (usePrediction) {
                dataSource.predictionEngine.addModels([new BasicViewportModel(), new WiderContextModel()]);
            } else {
                dataSource.predictionEngine.addModels([new BasicViewportModel(0, 0)]);
            }

            return dataSource;
        },
        createSerieCache(serieId) {
            return cacheManager.createSerieCache({serieId});
        },
        destroy() {
            requestManager.destroy();
        },
        setThrottle(kbps) {
            requestManager.setThrottle(kbps);
        }
    };
};
