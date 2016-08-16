import * as chai from 'chai';
var expect = chai.expect;
import TestUtil from "explorejs-common/test/TestUtil";
import RequestManager from "../src/modules/RequestManager";
import CacheManager from "../src/modules/CacheManager";
var rng = TestUtil.rng;
var l = TestUtil.rangeOnLevel;
var ll = TestUtil.rangesOnLevel.bind(TestUtil);

describe('End-to-end test', ()=> {
    //
    // var w;
    // beforeEach(done=> {
    //     w = {};
    //     w.RequestManager = new RequestManager();
    //     w.CacheManager = new CacheManager();
    //
    //     w.RequestManager.CacheManager = w.CacheManager;
    //     w.CacheManager.RequestManager = w.RequestManager;
    //     w.RequestManager.init(()=> {
    //
    //     });
    //
    // });
    // it('example navigation', done=> {
    //     // todo pan, zoom, check actual consistency on adapter, cacheprojection, and cache level
    // })
});