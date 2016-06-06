//todo _getRangeOfDiff
//putDataAtLevel
import * as chai from 'chai';
var expect = chai.expect;
import DynamicProjection from "/modules/DynamicProjection";
import TestUtil from "explorejs-common/test/TestUtil";
var rng = TestUtil.rng;
var l = TestUtil.rangeOnLevel;
var ll = TestUtil.rangesOnLevel.bind(TestUtil);
describe('DynamicProjection', () => {
    /**
     * @var {DynamicProjection}
     */
    var dynamicProjection;
    beforeEach(()=> {
        dynamicProjection = new DynamicProjection();
        //noinspection JSValidateTypes
        dynamicProjection.SerieCache = {
            getSerieManifest: function () {
                return {
                    levels: [
                        {id: '10s', step: 10 * 1000},
                        {id: '30s', step: 30 * 1000},
                        {id: '1m', step: 60 * 1000},
                        {id: '30m', step: 30 * 60 * 1000},
                        {id: '1h', step: 60 * 60 * 1000},
                        {id: '1d', step: 24 * 60 * 60 * 1000},
                        {id: '30d', step: 30 * 24 * 60 * 60 * 1000},
                        {id: '1y', step: 365 * 24 * 60 * 60 * 1000}
                    ]
                }
            }
        };
        dynamicProjection.WantedUnitWidth = 100;
        dynamicProjection.setup();
    });
    describe('_fitLevelId()', ()=> {
        it('should use raw for low scale', ()=> {
            expect(dynamicProjection._fitLevelId(0)).to.equal('raw');
        });
        it('<1s per px', ()=> {
            expect(dynamicProjection._fitLevelId(999)).to.equal('1m');
        });
        it('1s per px', ()=> {
            expect(dynamicProjection._fitLevelId(1000)).to.equal('1m');
        });
        it('>1s per px', ()=> {
            expect(dynamicProjection._fitLevelId(1001)).to.equal('1m');
        });
        it('25s per px', ()=> {
            expect(dynamicProjection._fitLevelId(25000)).to.equal('30m');
        });
        it('30s per px', ()=> {
            expect(dynamicProjection._fitLevelId(30000)).to.equal('30m');
        });
        it('1h per px', ()=> {
            expect(dynamicProjection._fitLevelId(60 * 60 * 1000)).to.equal('1d');
        });
        it('8h per px', ()=> {
            expect(dynamicProjection._fitLevelId(8 * 60 * 60 * 1000)).to.equal('30d');
        });
        it('12h per px', ()=> {
            expect(dynamicProjection._fitLevelId(12 * 60 * 60 * 1000)).to.equal('30d');
        });
        it('1d per px', ()=> {
            expect(dynamicProjection._fitLevelId(24 * 60 * 60 * 1000)).to.equal('30d');
        });
        it('7d per px', ()=> {
            expect(dynamicProjection._fitLevelId(7 * 24 * 60 * 60 * 1000)).to.equal('1y');
        });
    });
    describe('putDataAtLevel()', ()=> {

    });
});