import RequestManager from '../../../explorejs/modules/RequestManager';
import DataRequest from '../../../explorejs/data/DataRequest';
import CacheManager from "../../../explorejs/modules/CacheManager";
export default class CacheDemoController {
    constructor() {
        console.log('I am cache demo controller!!');
        // todo make simple initializer which hides following init chain. it will get simple JSON config
        var rm = new RequestManager();
        var cacheManager = new CacheManager();
        rm.CacheManager = cacheManager;
        cacheManager.RequestManager = rm;
        rm.init(()=> {
            cacheManager.createSerieCache({serieId: 's001'});
            cacheManager.createSerieCache({serieId: 's002'});
            cacheManager.createSerieCache({serieId: 's003'});


            rm.addRequest(new DataRequest('s001', '1m', '2015-11-12', '2015-12-12', 0));
            rm.addRequest(new DataRequest('s004', '30s', '2015-11-12', '2015-12-12', 0));
            rm.addRequest(new DataRequest('s002', '10s', '2016-01-02 13:12', '2016-01-02 13:34', 0));
            rm.addRequest(new DataRequest('s003', '1h', '2015-11-12', '2015-12-12', 0));
            rm.addRequest(new DataRequest('s001', '1d', '2015-11-12', '2016-12-12', 0));
        });







    }

    //noinspection JSUnusedGlobalSymbols
    testArrayPerformanceAsTimeSeriesBackend() {
        console.time('creation test')
        var array = new Array;
        for (var i = 0; i < 10000; i++) {
            array.push(i);
        }
        var array2 = new Array;
        for (var j = 0; j < 3000; j++) {
            array2.push(j);
        }
        console.timeEnd('creation test')

        console.log(array.length);

        console.time('remove test')
        array.splice(4000, 2000);
        console.timeEnd('remove test');
        console.log(array.length);
        console.time('concat test');
        var argus = [4000, 0].concat(array2);
        console.timeEnd('concat test');
        console.time('insert test')
        array.splice(...argus);
        console.timeEnd('insert test');
        console.log(array.length);

    }
}