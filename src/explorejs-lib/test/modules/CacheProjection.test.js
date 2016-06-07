import * as chai from 'chai';
var expect = chai.expect;
import CacheProjection from "../../src/modules/CacheProjection";
import TestUtil from "explorejs-common/test/TestUtil";
var rng = TestUtil.rng;
var l = TestUtil.rangeOnLevel;
var ll = TestUtil.rangesOnLevel.bind(TestUtil);
describe("CacheProjection", () => {
    var r, levelIds, cacheProjection;

    function spl(str) {
        return str ? str.split(' ').map(a=>r[a]) : [];
    }

    beforeEach(()=> {
        levelIds = ['raw', '10s', '30s', '1m', '10m', '30m', '1h', '8h', '1d', '7d', '30d', '1y'];

    });
    describe("_distributeRangesToLayers()", () => {
        beforeEach(()=> {
            r = [l('raw', 0, 3), l('1h', 4, 5), l('raw', 5, 7), l('30m', 8, 13), l('1h', 14, 19), l('1d', 20, 30), l('raw', 31, 32), l('7d', 32, 100)];
            cacheProjection = new CacheProjection().setup('raw', levelIds);
        });
        it('merge not existing', ()=> {
            expect(()=>cacheProjection._distributeRangesToLayers(r, '12s')).to.throw(RangeError);
        });
        it('merge raw', ()=> {
            expect(cacheProjection._distributeRangesToLayers(r, 'raw')).to.deep.equal({
                F: [], T: spl('0 2 6'), B: spl('1 3 4 5 7')

            });
        });
        it('merge 10s', ()=> {
            expect(cacheProjection._distributeRangesToLayers(r, '10s')).to.deep.equal({
                F: spl('0 2 6'), T: spl(), B: spl('1 3 4 5 7')
            });
        });
        it('merge 30s', ()=> {
            expect(cacheProjection._distributeRangesToLayers(r, '30s')).to.deep.equal({
                F: spl('0 2 6'), T: spl(), B: spl('1 3 4 5 7')
            });
        });
        it('merge 30m', ()=> {
            expect(cacheProjection._distributeRangesToLayers(r, '30m')).to.deep.equal({
                F: spl('0 2 6'), T: spl('3'), B: spl('1 4 5 7')
            });
        });
        it('merge 1h', ()=> {
            expect(cacheProjection._distributeRangesToLayers(r, '1h')).to.deep.equal({
                F: spl('0 2 3 6'), T: spl('1 4'), B: spl('5 7')
            });
        });
        it('merge 1d', ()=> {
            expect(cacheProjection._distributeRangesToLayers(r, '1d')).to.deep.equal({
                F: spl('0 1 2 3 4 6'), T: spl('5'), B: spl('7')
            });
        });
        it('merge 7d', ()=> {
            expect(cacheProjection._distributeRangesToLayers(r, '7d')).to.deep.equal({
                F: spl('0 1 2 3 4 5 6'), T: spl('7'), B: spl('')
            });
        });
        it('merge 30d', ()=> {
            expect(cacheProjection._distributeRangesToLayers(r, '30d')).to.deep.equal({
                F: spl('0 1 2 3 4 5 6 7'), T: spl(''), B: spl('')
            });
        });
        it('merge 10s but no of 10s, raw exists', ()=> {
            r = [l('30s', 0, 3), l('1h', 4, 5), l('30s', 5, 7), l('30m', 8, 13), l('1h', 14, 19), l('1d', 20, 30), l('30s', 31, 32), l('7d', 32, 100)];
            expect(cacheProjection._distributeRangesToLayers(r, '10s')).to.deep.equal({
                F: spl(''), T: spl(''), B: spl('0 1 2 3 4 5 6 7')
            });
        });

    });
    describe("recompile() integration tests", ()=> {
        var levelRanges = [
            ['raw', '1 3'],
            ['10s', '4 5'],
            ['30s', ''],
            ['1m', ''],
            ['30m', '7 9 10 11'],
            ['1h', '5 6 9 10'],
            ['8h', ''],
            ['1d', ''],
            ['7d', ''],
            ['30d', ''],
            ['1y', '']
        ];

        function transpose(configuration) {
            var array = [];
            for (var conf of configuration) {
                array.push(...TestUtil.rng(conf[1]).map(r=>({start: r.start, end: r.end, levelId: conf[0]})));
            }
            array.sort((a, b)=>a.start - b.start);
            return array;
        }


        var performTest = function (config) {
            var startProjection = cacheProjection.projection;
            var rangeSetWithLabels = rng(config.withRanges);
            rangeSetWithLabels.forEach((x)=>x.levelId = config.atLevel);

            var diff = cacheProjection.recompile(config.atLevel, rng(config.withRanges));

            var finalProjection = cacheProjection.projection;
            console.log(TestUtil.getRangeDrawing([startProjection, rangeSetWithLabels, finalProjection], ["before","new","after"], 8));
            expect(diff).to.deep.equal({
                added: ll(config.added), resized: ll(config.resized), removed: ll(config.removed)
            });
            expect(cacheProjection.projection).to.deep.equal(ll(config.projection));
        };
        it('recompile with empty set', ()=> {
            cacheProjection = new CacheProjection().setup('raw', levelIds);
            cacheProjection.projection = transpose(levelRanges);
            expect(cacheProjection.recompile('30s', [])).to.be.null;
        });
        it('basic example, projection at level raw', ()=> {
            cacheProjection = new CacheProjection().setup('raw', levelIds);
            cacheProjection.projection = transpose(levelRanges);
            performTest({
                atLevel: '30s',
                withRanges: '2 8',
                added: '30s 3 4; 30s 5 8',
                removed: '1h 5 6',
                resized: '30m 8 9 7 9',
                projection: 'raw 1 3; 30s 3 4; 10s 4 5; 30s 5 8; 30m 8 9; 1h 9 10; 30m 10 11'
            });
            performTest({
                atLevel: '1m',
                withRanges: '0 6',
                added: '1m 0 1',
                removed: '',
                resized: '',
                projection: '1m 0 1; raw 1 3; 30s 3 4; 10s 4 5; 30s 5 8; 30m 8 9; 1h 9 10; 30m 10 11'
            });
            performTest({
                atLevel: '1d',
                withRanges: '0 4 5 6 10 13 13 20',
                added: '1d 11 20',
                removed: '',
                resized: '',
                projection: '1m 0 1; raw 1 3; 30s 3 4; 10s 4 5; 30s 5 8; 30m 8 9; 1h 9 10; 30m 10 11; 1d 11 20'
            });
            performTest({
                atLevel: 'raw',
                withRanges: '2 6 12 13',
                added: 'raw 12 13; 1d 13 20',
                removed: '30s 3 4; 10s 4 5;',
                resized: 'raw 1 6 1 3; 30s 6 8 5 8; 1d 11 12 11 20;',
                projection: '1m 0 1; raw 1 6; 30s 6 8; 30m 8 9; 1h 9 10; 30m 10 11; 1d 11 12; raw 12 13; 1d 13 20'
            });
            performTest({
                atLevel: '1m',
                withRanges: '2 20',
                added: '1m 8 12; 1m 13 20',
                removed: '30m 8 9; 1h 9 10; 30m 10 11; 1d 11 12; 1d 13 20;',
                resized: '',
                projection: '1m 0 1; raw 1 6; 30s 6 8; 1m 8 12; raw 12 13; 1m 13 20'
            });
            performTest({
                atLevel: 'raw',
                withRanges: '0 2 2 4 4 8 8 10 15 16 17 18 19 20 21 22',
                added: 'raw 15 16; 1m 16 17; raw 17 18; 1m 18 19; raw 19 20; raw 21 22',
                removed: '1m 0 1; 30s 6 8;',
                resized: 'raw 0 10 1 6; 1m 10 12 8 12;1m 13 15 13 20',
                projection: 'raw 0 10; 1m 10 12; raw 12 13; 1m 13 15; raw 15 16; 1m 16 17; raw 17 18; 1m 18 19; raw 19 20; raw 21 22;'
            });
            performTest({
                atLevel: '10s',
                withRanges: '0 21',
                added: '10s 10 12; 10s 13 15; 10s 16 17; 10s 18 19; 10s 20 21',
                removed: '1m 10 12; 1m 13 15; 1m 16 17; 1m 18 19;',
                resized: '',
                projection: 'raw 0 10; 10s 10 12; raw 12 13; 10s 13 15; raw 15 16; 10s 16 17; raw 17 18; 10s 18 19; raw 19 20; 10s 20 21; raw 21 22'
            });
            performTest({
                atLevel: 'raw',
                withRanges: '0 22',
                added: '',
                removed: '10s 10 12; raw 12 13; 10s 13 15;raw 15 16; 10s 16 17; raw 17 18;10s 18 19; raw 19 20; 10s 20 21; raw 21 22',
                resized: 'raw 0 22 0 10',
                projection: 'raw 0 22'
            });
            performTest({
                atLevel: '1y',
                withRanges: '0 30',
                added: '1y 22 30',
                removed: '',
                resized: '',
                projection: 'raw 0 22; 1y 22 30'
            });
            performTest({
                atLevel: '30d',
                withRanges: '0 40',
                added: '30d 22 40',
                removed: '1y 22 30',
                resized: '',
                projection: 'raw 0 22; 30d 22 40'
            });

        });
        it('extended example, projection at level 1m', ()=> {
            cacheProjection = new CacheProjection().setup('1m', levelIds);
            cacheProjection.projection = [];
            expect(()=>cacheProjection.recompile('30s', rng('2 8'))).to.throw(RangeError);
            performTest({
                atLevel: '1m',
                withRanges: '0 6',
                added: '1m 0 6',
                removed: '',
                resized: '',
                projection: '1m 0 6;'
            });
            performTest({
                atLevel: '1d',
                withRanges: '0 4 5 6 10 13 13 20',
                added: '1d 10 20',
                removed: '',
                resized: '',
                projection: '1m 0 6; 1d 10 20'
            });
            expect(()=>cacheProjection.recompile('raw', rng('2 6 12 13'))).to.throw(RangeError);
            performTest({
                atLevel: '1m',
                withRanges: '2 20',
                added: '',
                removed: '1d 10 20',
                resized: '1m 0 20 0 6',
                projection: '1m 0 20'
            });
            expect(()=>cacheProjection.recompile('raw', rng('0 2 2 4 4 8 8 10 15 16 17 18 19 20 21 22'))).to.throw(RangeError);
            expect(()=>cacheProjection.recompile('10s', rng('0 21'))).to.throw(RangeError);
            expect(()=>cacheProjection.recompile('raw', rng('0 22'))).to.throw(RangeError);
            performTest({
                atLevel: '1y',
                withRanges: '0 30',
                added: '1y 20 30',
                removed: '',
                resized: '',
                projection: '1m 0 20; 1y 20 30'
            });
            performTest({
                atLevel: '30d',
                withRanges: '0 40',
                added: '30d 20 40',
                removed: '1y 20 30',
                resized: '',
                projection: '1m 0 20; 30d 20 40'
            });

        });
    });
});