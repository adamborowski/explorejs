// todo _getRangeOfDiff
// putDataAtLevel
import * as chai from 'chai';
var expect = chai.expect;

import DynamicProjection from '../../src/modules/DynamicProjection';
import CacheProjection from '../../src/modules/CacheProjection';
import TestUtil from 'explorejs-common/test/TestUtil';
import Range from 'explorejs-common/src/Range';
import ViewState from '../../src/modules/ViewState';
var rng = TestUtil.rng;
var l = TestUtil.rangeOnLevel;
var ll = TestUtil.rangesOnLevel.bind(TestUtil);

describe('DynamicProjection', () => {
    /**
     * @var {ViewState}
     */
    var viewState;

    beforeEach(()=> {
        viewState = new ViewState([
            {id: '10s', step: 10 * 1000},
            {id: '30s', step: 30 * 1000},
            {id: '1m', step: 60 * 1000},
            {id: '30m', step: 30 * 60 * 1000},
            {id: '1h', step: 60 * 60 * 1000},
            {id: '1d', step: 24 * 60 * 60 * 1000},
            {id: '30d', step: 30 * 24 * 60 * 60 * 1000},
            {id: '1y', step: 365 * 24 * 60 * 60 * 1000}
        ]);
        viewState.updatePreferredUnitWidth(100);
    });
    describe('_fitLevelId()', ()=> {
        const test = (scale, expectedLevelId)=> {
            viewState._scale = scale;
            expect(viewState._calculateLevelId()).to.equal(expectedLevelId);
        };

        it('should use raw for low scale', ()=> {
            test(0, 'raw');
        });
        it('<1s per px', ()=> {
            test(999, '1m');
        });
        it('1s per px', ()=> {
            test(1000, '1m');
        });
        it('>1s per px', ()=> {
            test(1001, '1m');
        });
        it('25s per px', ()=> {
            test(25000, '30m');
        });
        it('30s per px', ()=> {
            test(30000, '30m');
        });
        it('1h per px', ()=> {
            test(60 * 60 * 1000, '1d');
        });
        it('8h per px', ()=> {
            test(8 * 60 * 60 * 1000, '30d');
        });
        it('12h per px', ()=> {
            test(12 * 60 * 60 * 1000, '30d');
        });
        it('1d per px', ()=> {
            test(24 * 60 * 60 * 1000, '30d');
        });
        it('7d per px', ()=> {
            test(7 * 24 * 60 * 60 * 1000, '1y');
        });
    });
});
