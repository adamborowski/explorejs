// import expect from 'chai';
// import RequestManager from '../js/explorejs/modules/RequestManager';
// import DataRequest from '../js/explorejs/data/DataRequest';
// import CacheManager from "../js/explorejs/modules/CacheManager";
// describe("Integration test", () => {
//     var data;
//
//     before(() => {
//     });
//
//     // beforeEach(() => {
//     // });
//     describe("Basic test", () => {
//         var rm = new RequestManager();
//         var cacheManager = new CacheManager();
//         rm.CacheManager = cacheManager;
//         cacheManager.RequestManager = rm;
//         rm.init(()=> {
//             cacheManager.createSerieCache({serieId: 's001'});
//             cacheManager.createSerieCache({serieId: 's002'});
//             cacheManager.createSerieCache({serieId: 's003'});
//
//
//             rm.addRequest(new DataRequest('s001', '1m', '2015-11-12', '2015-12-12', 0));
//             rm.addRequest(new DataRequest('s004', '30s', '2015-11-12', '2015-12-12', 0));
//             rm.addRequest(new DataRequest('s002', '10s', '2016-01-02 13:12', '2016-01-02 13:34', 0));
//             rm.addRequest(new DataRequest('s003', '1h', '2015-11-12', '2015-12-12', 0));
//             rm.addRequest(new DataRequest('s001', '1d', '2015-11-12', '2016-12-12', 0));
//         });
//
//
//     });
// });