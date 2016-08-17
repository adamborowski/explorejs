import * as chai from 'chai';
var expect = chai.expect;
import WrapperDisplayCache from '../../src/modules/WrapperDisplayCache';
import TestUtil from "explorejs-common/test/TestUtil";
import WrapperIdFactory from "../../src/modules/WrapperIdFactory";
var rng = TestUtil.rng;
var l = TestUtil.rangeOnLevel;
var ll = TestUtil.rangesOnLevel.bind(TestUtil);
var idll = a=>TestUtil.rangesOnLevel(a).map(r=> {
    r.data = {id: 'same everywhere for testing'};
    return r;
});



describe('WrapperDisplayCache', ()=> {
    describe('_patchWrappers', ()=> {
        it('test scenario 1', ()=> {
            var cache = new WrapperDisplayCache(null);
            cache.wrappers = idll('1m 0 5; 2m 5 8; 1m 8 9; 2m 9 10');
            var diff2 = cache._patchWrappers(idll('1m 5 8; 1m 8 10'), idll('2m 5 8; 2m 9 11'));
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
});