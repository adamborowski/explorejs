import * as chai from 'chai';
var expect = chai.expect;
import DataSource from "../../src/modules/DataSource";
import LevelCache from "../../src/modules/LevelCache";
import TestUtil from "explorejs-common/test/TestUtil";
var rng = TestUtil.rng;
var l = TestUtil.rangeOnLevel;
var ll = TestUtil.rangesOnLevel.bind(TestUtil);

function performDiffTest(config) {
    var cache = config.cache;
    var levelCaches = {};
    var drawingData = [];
    var drawingNames = [];
    for (var levelId in cache) {
        var levelRanges = levelId == 'raw' ? TestUtil.rangesFromRaw(cache[levelId]) : rng(cache[levelId]);
        drawingData.push(levelRanges.map(a=>({start: a.start, end: a.end, levelId})));
        drawingNames.push(levelId);
        levelCaches[levelId] = new LevelCache({id: levelId});
        levelCaches[levelId].setup();
        levelCaches[levelId].putData(levelRanges.map(x=>levelId == 'raw' ? {$t: x.start} : {$s: x.start, $e: x.end}));
    }

    const removed = ll(config.diff.removed);
    const added = ll(config.diff.added);
    const resized = ll(config.diff.resized);
    drawingData = drawingData.concat([
        [], removed, added, resized.map(a=>a.existing), resized
    ]);
    drawingNames.push('=', 'del', 'add', 're-', 're+');


    console.log(TestUtil.getRangeDrawing(drawingData, drawingNames, 8));

    // now perform actual test


    var ds = new DataSource({
        getLevelCache: (levelId=>levelCaches[levelId]),
        getSerieManifest: ()=>({levels: []})
    }, ()=>null);
    var data = ds.getDataForDiff({removed, added, resized});
    console.log(TestUtil.getRangeDrawing([data.newData, data.oldData], ['new', 'old'], 8));
    expect({newData: data.newData.map(TestUtil.cleanRangeOnLevel), oldData: data.oldData}).to.deep.equal({
        newData: ll(config.result.newData),
        oldData: ll(config.result.oldData)
    });
}

describe("DataSource", () => {
    var r, levelIds, cacheProjection;

    function spl(str) {
        return str ? str.split(' ').map(a=>r[a]) : [];
    }

    beforeEach(()=> {
        levelIds = ['raw', '2s', '5s'];

    });
    describe('getDataWrappersForRange', ()=> {
        it('should fit wrappers for raw data', ()=> {
            var levelCache = new LevelCache({id: 'raw'});
            levelCache.setup();
            levelCache.putData(rng('0 5 5 10 10 15 15 20 20 25').map(x=>({$t: x.start} )));
            var ds = new DataSource({
                getLevelCache: ()=>levelCache,
                getSerieManifest: ()=>({levels: []})
            }, ()=>null);
            expect(ds.getDataWrappersForRange({start: 9, end: 14, levelId: 'raw'})).to.deep.equal([{
                levelId: 'raw',
                start: 10,
                end: 10,
                data: {'$t': 10}
            }]);
        });
        it('should return empty array for no data', ()=> {
            var levelCache = new LevelCache({id: '5s'});
            levelCache.setup();
            var ds = new DataSource({
                getLevelCache: ()=>levelCache,
                getSerieManifest: ()=>({levels: []})
            }, ()=>null);
            expect(ds.getDataWrappersForRange({start: 9, end: 14, levelId: '5s'})).to.be.empty;
        });
        it('should fit wrappers for raw data, exact point', ()=> {
            var levelCache = new LevelCache({id: 'raw'});
            levelCache.setup();
            levelCache.putData(rng('0 5 5 10 10 15 15 20 20 25').map(x=>({$t: x.start} )));
            var ds = new DataSource({
                getLevelCache: ()=>levelCache,
                getSerieManifest: ()=>({levels: []})
            }, ()=>null);
            expect(ds.getDataWrappersForRange({start: 10, end: 15, levelId: 'raw'})).to.deep.equal([{
                levelId: 'raw',
                start: 10,
                end: 10,
                data: {'$t': 10}
            }]);
        });
        it('should fit wrappers for aggregated data', ()=> {
            var levelCache = new LevelCache({id: '5s'});
            levelCache.setup();
            levelCache.putData(rng('0 5 5 10 10 15 15 20 20 25').map(x=>({$s: x.start, $e: x.end} )));
            var ds = new DataSource({
                getLevelCache: ()=>levelCache,
                getSerieManifest: ()=>({levels: []})
            }, ()=>null);
            expect(ds.getDataWrappersForRange({start: 9, end: 19, levelId: '5s'})).to.deep.equal([
                {
                    levelId: '5s',
                    start: 9,
                    end: 10,
                    data: {'$s': 5, '$e': 10}
                },
                {
                    levelId: '5s',
                    start: 10,
                    end: 15,
                    data: {'$s': 10, '$e': 15}
                },
                {
                    levelId: '5s',
                    start: 15,
                    end: 19,
                    data: {'$s': 15, '$e': 20}
                }]);
        });
        it('should fit wrappers for aggregated data, no need for clipping ranges', ()=> {
            var levelCache = new LevelCache({id: '5s'});
            levelCache.setup();
            levelCache.putData(rng('0 5 5 10 10 15 15 20 20 25').map(x=>({$s: x.start, $e: x.end} )));
            var ds = new DataSource({
                getLevelCache: ()=>levelCache,
                getSerieManifest: ()=>({levels: []})
            }, ()=>null);
            expect(ds.getDataWrappersForRange({start: 10, end: 15, levelId: '5s'})).to.deep.equal([
                {
                    levelId: '5s',
                    start: 10,
                    end: 15,
                    data: {'$s': 10, '$e': 15}
                }]);
        });
    });
    describe("getDataForDiff()", () => {
        it('test case 1', ()=> {
            performDiffTest({
                cache: {
                    'raw': '0 1 2 3 4 5 9 10 11 20 21',
                    '2s': '0 2 4 6 6 8 8 10 10 12 12 14 14 16',
                    '5s': '5 10 15 20 20 25'
                },
                diff: {
                    added: 'raw 0 4; 2s 4 5; 5s 5 10; raw 10 20',
                    removed: '2s 0 2; 1s 2 5',
                    resized: '2s 20 22 20 25'
                },
                result: {
                    newData: 'raw 0 0; raw 1 1; raw 2 2; raw 3 3; 2s 4 5; 5s 5 10; raw 10 10; raw 11 11',
                    oldData: '2s 0 2; 1s 2 5; 2s 22 25'
                }
            });
        });
        it('test case, no data', ()=> {
            performDiffTest({
                cache: {
                    'raw': '',
                    '2s': '',
                    '5s': ''
                },
                diff: {
                    added: 'raw 0 4; 2s 4 5; 5s 5 10; raw 10 20',
                    removed: '2s 0 2; 1s 2 5',
                    resized: '2s 20 22 20 25'
                },
                result: {
                    newData: '',
                    oldData: '2s 0 2; 1s 2 5; 2s 22 25'
                }
            });
        });
        it('test case, no change', ()=> {
            performDiffTest({
                cache: {
                    'raw': '0 1 2 3 4 5 9 10 11 20 21',
                    '2s': '0 2 4 6 6 8 8 10 10 12 12 14 14 16',
                    '5s': '5 10 15 20 20 25'
                },
                diff: {
                    added: '',
                    removed: '',
                    resized: ''
                },
                result: {
                    newData: '',
                    oldData: ''
                }
            });
        });
        it('test case, no data, no change', ()=> {
            performDiffTest({
                cache: {
                    'raw': '',
                    '2s': '',
                    '5s': ''
                },
                diff: {
                    added: '',
                    removed: '',
                    resized: ''
                },
                result: {
                    newData: '',
                    oldData: ''
                }
            });
        });
        it('test case, full data, full change', ()=> {
            performDiffTest({
                cache: {
                    'raw': '0 1 2 3 4 5 6 7 8 9',
                    '2s': '0 2 4 6 8',
                    '5s': '0 5 5 10'
                },
                diff: {
                    added: '5s 0 10',
                    removed: 'raw 0 10',
                    resized: ''
                },
                result: {
                    newData: '5s 0 5; 5s 5 10',
                    oldData: 'raw 0 10'
                }
            });
        });
        it('test case, lack of raw data, full change', ()=> {
            performDiffTest({
                cache: {
                    'raw': '0 1 8 9',
                    '2s': '0 2 4 6 8',
                    '5s': '0 5 5 10'
                },
                diff: {
                    added: '5s 0 10',
                    removed: 'raw 0 10',
                    resized: ''
                },
                result: {
                    newData: '5s 0 5; 5s 5 10',
                    oldData: 'raw 0 10'
                }
            });
        });
        it('test case, lack of new data, full change', ()=> {
            performDiffTest({
                cache: {
                    'raw': '0 1 2 3 4 5 6 7 8 9',
                    '2s': '0 2 4 6 8',
                    '5s': '10 15'
                },
                diff: {
                    added: '5s 0 10',
                    removed: 'raw 0 10',
                    resized: ''
                },
                result: {
                    newData: '',
                    oldData: 'raw 0 10'
                }
            });
        });
        it('test case, lack of new data, full change #2', ()=> {
            performDiffTest({
                cache: {
                    'raw': '0 1 2 3 4 5 6 7 8 9',
                    '2s': '0 2 4 6 8',
                    '5s': '10 15'
                },
                diff: {
                    added: '5s 0 11',
                    removed: 'raw 0 10',
                    resized: ''
                },
                result: {
                    newData: '5s 10 11',
                    oldData: 'raw 0 10'
                }
            });
        });
        it('problematic case, parts of points', ()=> {
            performDiffTest({
                cache: {
                    'raw': '0 1 2 3 4 5 6 7 8',
                    '3s': '0 3 3 6 6 9',
                },
                diff: {
                    added: 'raw 0 8',
                    removed: '',
                    resized: '3s 8 9 6 9'
                },
                result: {
                    newData: 'raw 0 0; raw 1 1; raw 2 2; raw 3 3; raw 4 4; raw 5 5; raw 6 6; raw 7 7',
                    oldData: '3s 6 8'
                }
            });
        });
        it('problematic case, parts of points', ()=> {
            performDiffTest({
                cache: {
                    'raw': '2 3 7 8',
                    '10s': '0 10',
                },
                diff: {
                    added: 'raw 2 3; 10s 3 7; raw 7 8; 10s 8 10',
                    removed: '10s 2 3; 10s 7 8',
                    resized: '10s 0 2 0 10'
                },
                result: {
                    newData: '',//todo
                    oldData: ''//todo
                }
            });
        });
        it('problematic case, parts of points, two aggregations', ()=> {
            performDiffTest({
                cache: {
                    '1s': '2 3 7 8',
                    '10s': '0 10',
                },
                diff: {
                    added: '1s 2 3; 10s 3 7; 1s 7 8; 10s 8 10',
                    removed: '10s 2 3; 10s 7 8',
                    resized: '10s 0 2 0 10'
                },
                result: {
                    // TODO takie rozwiązanie bazujące na mapowaniu range na dane - nie wystarcza chyba
                    // trzeba mieć dodatkowo informację,
                    newWrappers: '1s 2 3; 10s 3 7; 1s 7 8; 10s 8 10',//todo
                    oldWrappers: '',
                    resizedWrappers: '10s 0 2 0 10' // resizedDataWrappers
                }
            });
        });
    });
});