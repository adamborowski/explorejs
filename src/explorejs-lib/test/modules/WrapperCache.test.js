import * as chai from 'chai';
import {expect} from 'chai';
import sinonChai from 'sinon-chai';
chai.use(sinonChai);
import TestUtil from 'explorejs-common/test/TestUtil';

import WrapperCache from '../../src/modules/WrapperCache';

function p(levelId, start, end) {
    if (levelId == 'raw') {
        return {
            $t: start,
        }
    }
    else {
        return {
            $s: start,
            $e: end,
        }
    }
}

function performTest(config) {

    function wrappersFromString(dataPointConfig, wrappersRangesStr) {
        var data = dataPointConfig.levelId == 'raw' ? {$t: dataPointConfig.start} : {
            $s: dataPointConfig.start,
            $e: dataPointConfig.end
        };
        var wrappers = TestUtil.rangesWithoutLevel(wrappersRangesStr);
        for (var wrapper of wrappers) {
            wrapper.data = data;
            wrapper.levelId = dataPointConfig.levelId
        }
        return wrappers;
    }

    function extractRegisters() {
        return TestUtil.arrayToObject(wrapperCache.registers.getValues(), (r)=>r.registerId, (r)=>r._wrappers.map(TestUtil.cleanRange))
    }

    var wrapperCache = new WrapperCache();
    for (var dataPointStr in config.registers) {
        var dataPointConfig = TestUtil.rangeOnLevel(dataPointStr);
        var register = wrapperCache.registers.get(wrapperCache.idFactory(dataPointConfig));
        register._wrappers = wrappersFromString(dataPointConfig, config.registers[dataPointStr]);
    }

    var dataPointConfig = TestUtil.rangeOnLevel(config.dataPoint);
    var dataPoint = p(dataPointConfig.levelId, dataPointConfig.start, dataPointConfig.end);
    var diff;
    var registersBefore = extractRegisters();
    if (config.add != null) {
        var addConfig = TestUtil.rangeWithoutLevel(config.add);
        diff = wrapperCache.registerPointAtRange(dataPoint, addConfig.start, addConfig.end, dataPointConfig.levelId);
    }
    else if (config.remove != null) {
        var removeConfig = TestUtil.rangeWithoutLevel(config.remove);
        diff = wrapperCache.unregisterPointAtRange(dataPoint, removeConfig.start, removeConfig.end, dataPointConfig.levelId);
    }

    var purgeRange = (r)=> {
        delete r.data;
        delete r.id;
        if (r.existing) {
            delete r.existing.data;
        }
        return r;
    };

    // cleaning all data for quick comparison

    const actualAddedRanges = diff.added.map(purgeRange);
    const actualResizedRanges = diff.resized.map(purgeRange);
    const actualRemovedRanges = diff.removed.map(purgeRange);
    const expectedAddedRanges = TestUtil.rangesOnLevel(config.expectDiff.added);
    const expectedResizedRanges = TestUtil.rangesOnLevel(config.expectDiff.resized);
    const expectedRemovedRanges = TestUtil.rangesOnLevel(config.expectDiff.removed);

    console.log('expected diff')
    console.log(TestUtil.getRangeDrawing(
        [expectedRemovedRanges, expectedResizedRanges.map((a)=>a.existing), expectedResizedRanges, expectedAddedRanges],
        ['REM', 'RES', '*RES', 'ADD'], 1));

    // console.log('actual diff')
    // console.log(TestUtil.getRangeDrawing(
    //     [actualRemovedRanges, actualResizedRanges.map((a)=>a.existing), actualResizedRanges, actualAddedRanges],
    //     ['REM', 'RES', '*RES', 'ADD'], 1));

    expect({
        added: actualAddedRanges,
        resized: actualResizedRanges,
        removed: actualRemovedRanges

    }).to.deep.equal({
        added: expectedAddedRanges,
        resized: expectedResizedRanges,
        removed: expectedRemovedRanges,
    });
    var registers = extractRegisters();
    var expectedRegisters = TestUtil.mapObject(config.expectRegisters, (r)=>wrapperCache.idFactory(TestUtil.rangeOnLevel(r)), TestUtil.rangesWithoutLevel.bind(TestUtil));
    expect(registers).to.deep.equal(expectedRegisters);

    console.log('registers before');
    console.log(TestUtil.getRangeDrawing(TestUtil.mapObjectValues(registersBefore), Object.keys(registersBefore), 1));
    console.log('new after');
    console.log(TestUtil.getRangeDrawing(TestUtil.mapObjectValues(registers), Object.keys(registers), 1));
}


describe('WrapperCache', ()=> {
    describe('registerPointAtRange', ()=> {
        //todo perform other test to check if values survive during diff
        //because in following tests we check only ranges, not data itself
        it('remove register because range complements full range', ()=> {
            performTest({
                registers: {
                    '1m 0 60': '0 30',
                    '1m 120 180': '120 140; 160 180;',
                    '10s 0 10': '5 10;'
                },
                dataPoint: '1m 120 180',
                add: '140 160',
                expectRegisters: {
                    '1m 0 60': '0 30',
                    '10s 0 10': '5 10'
                },
                expectDiff: {
                    added: '',
                    resized: '1m 120 180 120 140',
                    removed: '1m 160 180;'
                }
            });
        });
        it('no register change because added one full wrapper', ()=> {
            const notChangedRegisters = {
                '1m 0 60': '0 30',
                '1m 120 180': '120 140; 160 180;',
                '10s 0 10': '5 10;'
            };
            performTest({
                registers: notChangedRegisters,
                dataPoint: '1m 60 120',
                add: '60 120',
                expectRegisters: notChangedRegisters,
                expectDiff: {
                    added: '1m 60 120',
                    resized: '',
                    removed: ''
                }
            });
        });
        it('add register change because added one partial wrapper', ()=> {
            performTest({
                registers: {
                    '1m 0 60': '0 30',
                    '1m 120 180': '120 140; 160 180;',
                    '10s 0 10': '5 10;'
                },
                dataPoint: '10s 10 20',
                add: '10 14',
                expectRegisters: {
                    '1m 0 60': '0 30',
                    '1m 120 180': '120 140; 160 180;',
                    '10s 0 10': '5 10;',
                    '10s 10 20': '10 14;'
                },
                expectDiff: {
                    added: '10s 10 14',
                    resized: '',
                    removed: ''
                }
            });
        });
    });
    describe('unregisterPointAtRange', ()=> {
        it('remove register because range was last in register', ()=> {
            performTest({
                registers: {
                    '1m 0 60': '0 30',
                    '1m 120 180': '120 140; 160 180;',
                    '10s 0 10': '5 10;'
                },
                dataPoint: '1m 120 180',
                remove: '120 180',
                expectRegisters: {
                    '1m 0 60': '0 30',
                    '10s 0 10': '5 10'
                },
                expectDiff: {
                    added: '',
                    resized: '',
                    removed: '1m 120 140; 1m 160 180'
                }
            });
        });
        it('add register because part of full data point has to be removed', ()=> {
            performTest({
                registers: {
                },
                dataPoint: '1m 120 180',
                remove: '160 170',
                expectRegisters: {
                    '1m 120 180': '120 160; 170 180',
                },
                expectDiff: {
                    added: '1m 170 180',
                    resized: '1m 120 160 120 180;',
                    removed: ''
                }
            });
        });
        it('no register change because removed one full wrapper', ()=> {
            const notChangedRegisters = {
                '1m 0 60': '0 30',
                '1m 120 180': '120 140; 160 180;',
                '10s 0 10': '5 10;'
            };
            performTest({
                registers: notChangedRegisters,
                dataPoint: '1m 60 120',
                remove: '60 120',
                expectRegisters: notChangedRegisters,
                expectDiff: {
                    added: '',
                    resized: '',
                    removed: '1m 60 120'
                }
            });
        });
        it('no change because removed wrapper which didn\'t exist', ()=> {
            const notChangedRegisters = {
                '1m 0 60': '0 30',
                '1m 120 180': '120 140; 160 180;',
                '10s 0 10': '5 10;'
            };
            performTest({
                registers: notChangedRegisters,
                dataPoint: '1m 0 60',
                remove: '30 60',
                expectRegisters: notChangedRegisters,
                expectDiff: {
                    added: '',
                    resized: '',
                    removed: ''
                }
            });
        });
    });
});