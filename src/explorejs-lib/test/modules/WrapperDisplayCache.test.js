import * as chai from 'chai';
var expect = chai.expect;
import WrapperDisplayCache from '../../src/modules/WrapperDisplayCache';
import TestUtil from "explorejs-common/test/TestUtil";
var rng = TestUtil.rng;
var l = TestUtil.rangeOnLevel;
var ll = TestUtil.rangesOnLevel.bind(TestUtil);

describe('WrapperDisplayCache', ()=> {
    describe('_patchWrappers', ()=> {
        it('test scenario 1', ()=> {
            var cache = new WrapperDisplayCache(null);
            cache.wrappers = ll('1m 0 5; 2m 5 8; 1m 8 9; 2m 9 10');
            var diff2 = cache._patchWrappers(ll('1m 5 8; 1m 8 10'), ll('2m 5 8; 2m 9 11'));
            expect({
                added: diff2.added.map(TestUtil.cleanResizedRangeOnLevel),
                removed: diff2.removed.map(TestUtil.cleanResizedRangeOnLevel),
                resized: diff2.resized.map(TestUtil.cleanResizedRangeOnLevel)
            }).to.deep.equal({
                added: [],
                removed: ll('2m 5 8; 1m 8 9; 2m 9 10'),
                resized: ll('1m 0 10 0 5')
            });
        });
    });
    // describe('top-bottom tests', ()=> {
    //     performTest({
    //         cache: {
    //             '1s': '0 1 1 2 2 3 3 4 4 5 5 6',
    //             '2s': '2 4 6 8',
    //             '5s': '0 5 10 15'
    //         },
    //         wrappers: '5s 0 1; 1s 1 2; 2s 2 4; 5s 4 5; 5s 10 14;',
    //         update: {
    //             removed: '1s 1 2; 2s 2 4; 5s 4 14',
    //             resized: '5s 0 14 0 1',
    //             added: '',
    //
    //         },
    //         expectDiff: {
    //             removed:''
    //         }
    //     });
    // });
});