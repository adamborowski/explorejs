// todo _getRangeOfDiff
// putDataAtLevel
import * as chai from 'chai';
import OrderedSegmentArray from 'explorejs-common/src/OrderedSegmentArray';
var expect = chai.expect;

import DynamicProjection from '../../src/modules/DynamicProjection';
import TestUtil from 'explorejs-common/test/TestUtil';
import Range from 'explorejs-common/src/Range';
import ViewState from '../../src/modules/ViewState';
var rng = TestUtil.rng;
var l = TestUtil.rangeOnLevel;
var ll = TestUtil.rangesOnLevel.bind(TestUtil);

describe('DynamicProjection', () => {
    /**
     * @var {DynamicProjection}
     */
    var dynamicProjection;

    beforeEach(()=> {
        const levels = [
            {id: '10s', step: 10 * 1000},
            {id: '30s', step: 30 * 1000},
            {id: '1m', step: 60 * 1000},
            {id: '30m', step: 30 * 60 * 1000},
            {id: '1h', step: 60 * 60 * 1000},
            {id: '1d', step: 24 * 60 * 60 * 1000},
            {id: '30d', step: 30 * 24 * 60 * 60 * 1000},
            {id: '1y', step: 365 * 24 * 60 * 60 * 1000}
        ];

        dynamicProjection = new DynamicProjection(new ViewState(levels));
        // noinspection JSValidateTypes
        dynamicProjection.SerieCache = {
            getSerieManifest: function () {
                return {
                    levels: levels
                };
            }
        };
        dynamicProjection.WantedUnitWidth = 100;
        dynamicProjection.setup();
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
    function performTest(currentRanges, targetRanges, currentLevelId, targetLevelId, currentRange, targetRange) {
        dynamicProjection.SerieCache.getProjectionDisposer = ()=>({ // mock
            getProjection: (levelId)=> {
                if (levelId == currentLevelId) return {projection: currentRanges};
                if (levelId == targetLevelId) return {projection: targetRanges};
                throw new Error(`Unexpected ask for projection ${levelId} during tests`);
            }
        });
        var clippedCurrentRanges = OrderedSegmentArray.cutRangeSet(currentRanges, currentRange.left, currentRange.right, a=>({levelId: a.levelId})).overlap;
        var clippedTargetRanges = OrderedSegmentArray.cutRangeSet(targetRanges, targetRange.left, targetRange.right, a=>({levelId: a.levelId})).overlap;

        var diff = dynamicProjection.calcDiffDueToProjectionChange(currentLevelId, targetLevelId, currentRange, targetRange);
        var result = TestUtil.applyDiff(clippedCurrentRanges, diff);

        console.log(TestUtil.getRangeDrawing(
            [clippedCurrentRanges, diff.removed, diff.resized.map(a=>a.existing), diff.resized, diff.added, result, clippedTargetRanges],
            ['current', 'removed', 'resized from ', 'resized to', 'added', 'result', 'expected'], 1));

        expect(result.map(a=>({
            start: a.start,
            end: a.end,
            levelId: a.levelId
        }))).to.deep.equal(clippedTargetRanges);
        if (result.length) {
            expect(result[0].start).to.be.not.lessThan(targetRange.left);
            expect(result[result.length - 1].end).to.be.not.greaterThan(targetRange.right);

        }
    }
    describe('calcDiffDueToProjectionChange() - unbounded ranges', ()=> {
        describe('narrower to wider, eg. 10s to 1h', ()=> {
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

        describe('wider to narrower, eg. 1d to 1h', ()=> {
            it('example case 1', ()=> {
                var currentData = ll('1d 0 70; 30d 140 150; 1d 150 180; 30d 180 190; 1y 190 230; 30d 230 250; 1d 250 280; 1y 280 290; 1d 290 310');
                var targetData = ll('1h 0 10; 1d 10 70; 1h 70 140; 30d 140 150; 1h 150 180; 30d 180 190; 1y 190 200; 1h 200 210; 1y 210 230; 30d 230 250; 1h 250 270; 1d 270 280; 1y 280 290; 1d 290 310');

                performTest(currentData, targetData, '1d', '1h', Range.unbounded(), Range.unbounded());
            });
            it('example case 2', ()=> {
                var currentData = ll('1y 0 310');
                var targetData = ll('1h 0 10; 1d 10 70; 1h 70 140; 30d 140 150; 1h 150 180; 30d 180 190; 1y 190 200; 1h 200 210; 1y 210 230; 30d 230 250; 1h 250 270; 1d 270 280; 1y 280 290; 1d 290 310');

                performTest(currentData, targetData, '1y', 'raw', Range.unbounded(), Range.unbounded());
            });
            it('example case 3', ()=> {
                var currentData = ll('1y 0 260; 1y 275 300');
                var targetData = ll('1h 0 10; 1d 10 70; 1h 70 140; raw 140 150; 1h 150 180; raw 180 190; 1y 190 200; 1h 200 210; 1y 210 230; 30d 230 250; raw 250 270; 1d 270 280; 1y 280 290; 1d 290 310');

                performTest(currentData, targetData, '1y', 'raw', Range.unbounded(), Range.unbounded());
            });
            it('example case 4', ()=> {
                var currentData = ll('1h 0 10; 1d 10 70; 1h 70 140; 30d 140 150; 1h 150 180; 30d 180 190; 1y 190 200; 1h 200 210; 1y 210 230; 30d 230 250; 1h 250 270; 1d 270 280; 1y 280 290; 1d 290 310');
                var targetData = ll('1h 0 10; 1d 10 70; 1h 70 140; 30d 140 150; 1h 150 180; 30d 180 190; 1y 190 200; 1h 200 210; 1y 210 230; 30d 230 250; 1h 250 270; 1d 270 280; 1y 280 290; 1d 290 310');

                performTest(currentData, targetData, '1h', 'raw', Range.unbounded(), Range.unbounded());
            });
            it('example case 5', ()=> {
                var currentData = ll('30d 4 80; 30d 140 150; 1y 150 180; 30d 180 190; 1y 190 200;  1y 210 230; 30d 230 250; 1y 250 290; 30d 290 310');
                var targetData = ll('1h 0 10; 1d 10 70; 1h 70 140; 30d 140 150; 1h 150 180; 30d 180 190; 1y 190 200; 1h 200 210; 1y 210 230; 30d 230 250; 1h 250 270; 1d 270 280; 1y 280 290; 1d 290 310');

                performTest(currentData, targetData, '30d', '1h', Range.unbounded(), Range.unbounded());
            });
        });
    });
    describe('calcDiffDueToProjectionChange() - bounded ranges', ()=> {

        describe('zoomin zoomout', ()=> {
            it('example case 1', ()=> {
                var currentData = ll('1d 0 100');
                var targetData = ll('1h 0 100');

                performTest(currentData, targetData, '1d', '1h', Range.closed(20, 80), Range.closed(100, 200));
            });
            it('example case 2', ()=> {
                var currentData = ll('1d 0 100');
                var targetData = ll('1h 0 100');

                performTest(currentData, targetData, '1d', '1h', Range.closed(20, 80), Range.closed(70, 79));
            });
            it('example case 3 - move only', ()=> {
                var currentData = ll('1d 0 100');
                var targetData = ll('1d 0 100');

                performTest(currentData, targetData, '1d', '1d', Range.closed(70, 100), Range.closed(40, 80));
            });
        });

    });
});
