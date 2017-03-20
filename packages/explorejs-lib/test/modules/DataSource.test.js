import * as chai from 'chai';
const expect = chai.expect;

import DataSource from '../../src/modules/DataSource';
import LevelCache from '../../src/modules/LevelCache';
import {TestUtil} from 'explorejs-common';
import WrapperIdFactory from '../../src/modules/WrapperIdFactory';
const rng = TestUtil.rng;
const ll = TestUtil.rangesOnLevel.bind(TestUtil);

const levelIds = ['raw', '1s', '2s', '3s', '5s', '10s'];

function performDiffTest(config) {
    const cache = config.cache;
    const levelCaches = {};
    let drawingData = [];
    const drawingNames = [];

    for (let levelId of levelIds) {
        const rangesStr = cache[levelId];

        levelCaches[levelId] = new LevelCache({id: levelId});
        levelCaches[levelId].setup();
        if (rangesStr) {
            const levelRanges = levelId === 'raw' ? TestUtil.rangesFromRaw(rangesStr) : rng(rangesStr);

            drawingData.push(levelRanges.map(a => ({start: a.start, end: a.end, levelId})));
            drawingNames.push(levelId);
            levelCaches[levelId].putData(levelRanges.map(x => levelId === 'raw' ? {$t: x.start} : {
                    $s: x.start,
                    $e: x.end
                }).map(a => {
                a.id = WrapperIdFactory.globalDebug(levelId, a);
                return a;
            }));
        }
    }

    const removed = ll(config.diff.removed);
    const added = ll(config.diff.added);
    const resized = ll(config.diff.resized);
    const ds = new DataSource({
        getLevelCache: (levelId => levelCaches[levelId]),
        getSerieManifest: () => ({levels: []})
    }, () => null);
    const wrappers = ds._wrapRanges(ll(config.wrappers));

    ds._newWrappers = wrappers;
    drawingData = drawingData.concat([
        wrappers, [], removed, resized.map(a => a.existing), resized, added
    ]);
    drawingNames.push('wra', '=', 'del', 're-', 're+', 'add');

    console.log(TestUtil.getRangeDrawing(drawingData, drawingNames, 8));

    // now perform actual test

    const diff = ds.getWrapperDiffForProjectionDiff({removed, added, resized});

    console.log(TestUtil.getRangeDrawing([
        diff.removed,
        diff.resized.map(r => r.existing),
        diff.resized, diff.added
    ], ['removed', 'resized', 'resized*', 'added'], 8));
    expect({
        removed: diff.removed.map(TestUtil.cleanRangeOnLevel),
        resized: diff.resized.map(TestUtil.cleanResizedRangeOnLevel),
        added: diff.added.map(TestUtil.cleanRangeOnLevel)
    }).to.deep.equal({
        removed: ll(config.result.removed),
        resized: ll(config.result.resized),
        added: ll(config.result.added)
    });
}

describe('DataSource', () => {

    describe.skip('getDataForDiff()', () => {
        it('test case 1', () => {
            performDiffTest({
                cache: {
                    'raw': '0 1 2 3 4 5 9 10 11 20 21',
                    '2s': '0 2 4 6 6 8 8 10 10 12 12 14 14 16',
                    '5s': '5 10 15 20 20 25'
                },
                wrappers: '2s 0 2; 1s 2 3; 1s 3 4; 1s 4 5; 2s 20 22; 2s 22 24; 2s 24 25',
                diff: {
                    added: 'raw 0 4; 2s 4 5; 5s 5 10; raw 10 20',
                    removed: '2s 0 2; 1s 2 5',
                    resized: '2s 20 22 20 25'
                },
                result: {
                    added: 'raw 0 0; raw 1 1; raw 2 2; raw 3 3; 2s 4 5; 5s 5 10; raw 10 10; raw 11 11',
                    removed: '2s 0 2;',
                    resized: ''
                }
            });
        });
        it('test case, no data', () => {
            performDiffTest({
                cache: {
                    'raw': '',
                    '2s': '',
                    '5s': ''
                },
                wrappers: '',
                diff: {
                    added: 'raw 0 4; 2s 4 5; 5s 5 10; raw 10 20',
                    removed: '2s 0 2; 1s 2 5',
                    resized: '2s 20 22 20 25'
                },
                result: {
                    added: '',
                    resized: '',
                    removed: ''
                }
            });
        });
        it('test case, no change', () => {
            performDiffTest({
                cache: {
                    'raw': '0 1 2 3 4 5 9 10 11 20 21',
                    '2s': '0 2 4 6 6 8 8 10 10 12 12 14 14 16',
                    '5s': '5 10 15 20 20 25'
                },
                wrappers: '5s 5 10; 2s 10 12; 2s 12 14;',
                diff: {
                    added: '',
                    removed: '',
                    resized: ''
                },
                result: {
                    added: '',
                    removed: '',
                    resized: ''
                }
            });
        });
        it('test case, no data, no change', () => {
            performDiffTest({
                cache: {
                    'raw': '',
                    '2s': '',
                    '5s': ''
                },
                wrappers: '',
                diff: {
                    added: '',
                    removed: '',
                    resized: ''
                },
                result: {
                    added: '',
                    removed: '',
                    resized: ''
                }
            });
        });
        it('test case, full data, full change', () => {
            performDiffTest({
                cache: {
                    'raw': '0 1 2 3 4 5 6 7 8 9',
                    '2s': '0 2 4 6 8',
                    '5s': '0 5 5 10'
                },
                wrappers: 'raw 0 1; raw 1 2; raw 2 3; raw 3 4; raw 4 5; raw 5 6; raw 6 7; raw 7 8; raw 8 9; raw 9 10',
                diff: {
                    added: '5s 0 10',
                    removed: 'raw 0 10',
                    resized: ''
                },
                result: {
                    added: '5s 0 5; 5s 5 10',
                    removed: 'raw 0 0; raw 1 1; raw 2 2; raw 3 3; raw 4 4; raw 5 5; raw 6 6; raw 7 7; raw 8 8; raw 9 9',
                    resized: ''
                }
            });
        });
        it('test case, lack of raw data, full change', () => {
            performDiffTest({
                cache: {
                    'raw': '0 1 8 9',
                    '2s': '0 2 4 6 8',
                    '5s': '0 5 5 10'
                },
                wrappers: 'raw 0 1; raw 1 2;2s 4 6; raw 8 9; raw 9 10',
                diff: {
                    added: '5s 0 10',
                    removed: 'raw 0 10',
                    resized: ''
                },
                result: {
                    added: '5s 0 5; 5s 5 10',
                    removed: 'raw 0 0; raw 1 1; raw 8 8; raw 9 9',
                    resized: ''
                }
            });
        });
        it('test case, lack of new data, full change', () => {
            performDiffTest({
                cache: {
                    'raw': '0 1 2 3 4 5 6 7 8 9',
                    '2s': '0 2 4 6 8 10',
                    '5s': '10 15'
                },
                wrappers: 'raw 0 1; raw 1 2; raw 2 3; raw 3 4; raw 4 5; raw 5 6; raw 6 7; raw 7 8; raw 8 9; raw 9 10',
                diff: {
                    added: '5s 0 10',
                    removed: 'raw 0 10',
                    resized: ''
                },
                result: {
                    added: '',
                    removed: 'raw 0 0; raw 1 1; raw 2 2; raw 3 3; raw 4 4; raw 5 5; raw 6 6; raw 7 7; raw 8 8; raw 9 9',
                    resized: ''
                }
            });
        });
        it('test case, lack of new data, full change #2', () => {
            performDiffTest({
                cache: {
                    'raw': '0 1 2 3 4 5 6 7 8 9',
                    '2s': '0 2 4 6 8 10',
                    '5s': '10 15'
                },
                wrappers: 'raw 0 1; raw 1 2; raw 2 3; raw 3 4; raw 4 5; raw 5 6; raw 6 7; raw 7 8; raw 8 9; raw 9 10',
                diff: {
                    added: '5s 0 11',
                    removed: 'raw 0 10',
                    resized: ''
                },
                result: {
                    added: '5s 10 11',
                    removed: 'raw 0 0; raw 1 1; raw 2 2; raw 3 3; raw 4 4; raw 5 5; raw 6 6; raw 7 7; raw 8 8; raw 9 9;',
                    resized: ''
                }
            });
        });
        it('problematic case, parts of points', () => {
            performDiffTest({
                cache: {
                    'raw': '0 1 2 3 4 5 6 7 8',
                    '3s': '0 3 3 6 6 9'
                },
                wrappers: '3s 0 3; 3s 3 6; 3s 6 9',
                diff: {
                    removed: '3s 0 3; 3s 3 6',
                    resized: '3s 8 9 6 9',
                    added: 'raw 0 8'
                },
                result: {
                    added: 'raw 0 0; raw 1 1; raw 2 2; raw 3 3; raw 4 4; raw 5 5; raw 6 6; raw 7 7',
                    removed: '3s 0 3; 3s 3 6;',
                    resized: '3s 8 9 6 9'
                }
            });
        });
        it('problematic case, parts of points #2', () => { // zoom in from 10s to raw
            performDiffTest({
                cache: {
                    '1s': '2 3 7 8',
                    '10s': '0 10'
                },
                wrappers: '10s 0 10',
                diff: {
                    added: '1s 2 3; 10s 3 7; 1s 7 8; 10s 8 10',
                    removed: '',
                    resized: '10s 0 2 0 10'
                },
                result: {
                    added: '1s 2 3; 10s 3 7; 1s 7 8; 10s 8 10',
                    removed: '',
                    resized: '10s 0 2 0 10'
                }
            });
        });
        it('problematic case, parts of points, zoom out', () => {
            performDiffTest({
                cache: {
                    '1s': '2 3 7 8',
                    '10s': '0 10'
                },
                wrappers: '1s 2 3; 1s 7 8;',
                diff: {
                    added: '10s 0 2; 10s 3 7; 10s 8 10',
                    removed: '',
                    resized: ''
                },
                result: {
                    added: '10s 0 2; 10s 3 7; 10s 8 10', // yes, same point wrapped into many smaller portions
                    removed: '',
                    resized: ''
                }
            });
        });
    });
});
