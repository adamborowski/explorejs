//todo _getRangeOfDiff
//putDataAtLevel
import * as chai from 'chai';
var expect = chai.expect;
import DynamicProjection from "/modules/DynamicProjection";
import CacheProjection from "../../src/modules/CacheProjection";
import TestUtil from "explorejs-common/test/TestUtil";
import Range from "explorejs-common/src/Range";
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
    describe('_getUnsupportedRanges()', ()=> {
        it('example case', ()=> {
            var rangeSet = ll('1h 0 10; 1d 10 70; 1h 70 140; 30d 140 150; 1h 150 180; 30d 180 190; 1y 190 200; 1h 200 210; 1y 210 230; 30d 230 250; 1h 250 270; 1d 270 280; 1y 280 290; 1d 290 310');
            expect(dynamicProjection._getUnsupportedRanges(rangeSet, {
                id: '1y',
                step: 365 * 24 * 60 * 60 * 1000
            })).to.deep.equal(ll('1h 0 10; 1d 10 70; 1h 70 140; 30d 140 150; 1h 150 180; 30d 180 190;  1h 200 210; 30d 230 250; 1h 250 270; 1d 270 280; 1d 290 310'));
            expect(dynamicProjection._getUnsupportedRanges(rangeSet, {
                id: '30d',
                step: 30 * 24 * 60 * 60 * 1000
            })).to.deep.equal(ll('1h 0 10; 1d 10 70; 1h 70 140; 1h 150 180; 1h 200 210; 1h 250 270;1d 270 280; 1d 290 310;'));
            expect(dynamicProjection._getUnsupportedRanges(rangeSet, {
                id: '1d',
                step: 24 * 60 * 60 * 1000
            })).to.deep.equal(ll('1h 0 10; 1h 70 140; 1h 150 180; 1h 200 210; 1h 250 270;'));
            expect(dynamicProjection._getUnsupportedRanges(rangeSet, {
                id: '1h',
                step: 60 * 60 * 1000
            })).to.be.empty;
            expect(dynamicProjection._getUnsupportedRanges(rangeSet, {
                id: 'raw',
                step: 0
            })).to.be.empty;
        });
    });
    // describe('_getNewlySupportedRanges()', ()=> {
    //     it('example case', ()=> {
    //         var rangeSet = ll('1h 0 10; 1d 10 70; 1h 70 140; 30d 140 150; 1h 150 180; 30d 180 190; 1y 190 200; 1h 200 210; 1y 210 230; 30d 230 250; 1h 250 270; 1d 270 280; 1y 280 290; 1d 290 310');
    //         expect(dynamicProjection._getNewlySupportedRanges(rangeSet, {
    //             id: '30d',
    //             step: 30 * 24 * 60 * 60 * 1000
    //         })).to.deep.equal(ll(''));
    //         expect(dynamicProjection._getNewlySupportedRanges(rangeSet, {
    //             id: '1d',
    //             step: 24 * 60 * 60 * 1000
    //         })).to.deep.equal(ll(''));
    //         expect(dynamicProjection._getNewlySupportedRanges(rangeSet, {
    //             id: '1h',
    //             step: 60 * 60 * 1000
    //         })).to.deep.equal(ll(''));
    //         expect(dynamicProjection._getNewlySupportedRanges(rangeSet, {
    //             id: 'raw',
    //             step: 0
    //         })).to.deep.equal(ll(''));
    //     });
    // });
    describe('callDiffDueToProjectionChange()', ()=> {
        //todo put some data at different levels
        function performTest(currentProjectionData, targetProjectionData, currentLevelId, targetLevelId, currentRange, targetRange) {
            dynamicProjection.SerieCache.getProjectionDisposer = ()=>({ //mock
                getProjection: (levelId)=> {
                    if (levelId == currentLevelId) return {projection: currentProjectionData};
                    if (levelId == targetLevelId) return {projection: targetProjectionData};
                    throw new Error(`Unexpected ask for projection ${levelId} during tests`);
                }
            });
            var diff = dynamicProjection.callDiffDueToProjectionChange(currentLevelId, targetLevelId, currentRange, targetRange);
            console.log(TestUtil.getRangeDrawing(
                [currentProjectionData, diff.removed, diff.resized.map(a=>a.existing), diff.resized, diff.added, diff.result, targetProjectionData],
                ['current', 'removed', 'resized from ', 'resized to', 'added', 'result', 'expected'], 1));

            expect(diff.result.map(a=>({
                start: a.start,
                end: a.end,
                levelId: a.levelId
            }))).to.deep.equal(targetProjectionData);
        }

        it('example case 1', ()=> {
            var currentData = ll('1h 0 10; 1d 10 70; 1h 70 140; 30d 140 150; 1h 150 180; 30d 180 190; 1y 190 200; 1h 200 210; 1y 210 230; 30d 230 250; 1h 250 270; 1d 270 280; 1y 280 290; 1d 290 310');
            var targetData = ll('1d 0 70; 30d 140 150; 1d 150 180; 30d 180 190; 1y 190 230; 30d 230 250; 1d 250 280; 1y 280 290; 1d 290 310');
            performTest(currentData, targetData, '1h', '1d', Range.unbounded(), Range.unbounded());
        });
        it('example case 2', ()=> {
            var currentData = ll('1h 0 10; 1d 10 70; 1h 70 140; 30d 140 150; 1h 150 180; 30d 180 190; 1y 190 200; 1h 200 210; 1y 210 230; 30d 230 250; 1h 250 270; 1d 270 280; 1y 280 290; 1d 290 310');
            var targetData = ll('1y 0 310');
            performTest(currentData, targetData, 'raw', '1y', Range.unbounded(), Range.unbounded());
        });
        it('example case 3', ()=> {
            var currentData = ll('1h 0 10; 1d 10 70; 1h 70 140; raw 140 150; 1h 150 180; raw 180 190; 1y 190 200; 1h 200 210; 1y 210 230; 30d 230 250; raw 250 270; 1d 270 280; 1y 280 290; 1d 290 310');
            var targetData = ll('1y 0 260; 1y 275 300');
            performTest(currentData, targetData, 'raw', '1y', Range.unbounded(), Range.unbounded());
        });
        it('example case 4', ()=> {
            var currentData = ll('1h 0 10; 1d 10 70; 1h 70 140; 30d 140 150; 1h 150 180; 30d 180 190; 1y 190 200; 1h 200 210; 1y 210 230; 30d 230 250; 1h 250 270; 1d 270 280; 1y 280 290; 1d 290 310');
            var targetData = ll('1h 0 10; 1d 10 70; 1h 70 140; 30d 140 150; 1h 150 180; 30d 180 190; 1y 190 200; 1h 200 210; 1y 210 230; 30d 230 250; 1h 250 270; 1d 270 280; 1y 280 290; 1d 290 310');
            performTest(currentData, targetData, 'raw', '1h', Range.unbounded(), Range.unbounded());
        });
        it('example case 5', ()=> {
            var currentData = ll('1h 0 10; 1d 10 70; 1h 70 140; 30d 140 150; 1h 150 180; 30d 180 190; 1y 190 200; 1h 200 210; 1y 210 230; 30d 230 250; 1h 250 270; 1d 270 280; 1y 280 290; 1d 290 310');
            var targetData = ll('30d 4 80; 30d 140 150; 1y 150 180; 30d 180 190; 1y 190 200;  1y 210 230; 30d 230 250; 1y 250 290; 30d 290 310');
            performTest(currentData, targetData, '1h', '30d', Range.unbounded(), Range.unbounded());
        });
    });
});