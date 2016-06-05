import * as chai from 'chai';
var expect = chai.expect;
import CacheProjection from "/modules/CacheProjection";
import TestUtil from "explorejs-common/test/TestUtil";
var rng = TestUtil.rng;
describe("CacheProjection", () => {
    var r, levelIds, cacheProjection;

    function l(start, end, levelId) {
        return {start: start, end: end, levelId: levelId};
    }

    function spl(str) {
        return str ? str.split(' ').map(a=>r[a]) : [];
    }

    beforeEach(()=> {
        levelIds = ['raw', '10s', '30s', '1m', '10m', '30m', '1h', '8h', '1d', '7d', '30d', '1y'];

    });
    describe("_distributeRangesToLayers()", () => {
        beforeEach(()=> {
            r = [l(0, 3, 'raw'), l(4, 5, '1h'), l(5, 7, 'raw'), l(8, 13, '30m'), l(14, 19, '1h'), l(20, 30, '1d'), l(31, 32, 'raw'), l(32, 100, '7d')];
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
            r = [l(0, 3, '30s'), l(4, 5, '1h'), l(5, 7, '30s'), l(8, 13, '30m'), l(14, 19, '1h'), l(20, 30, '1d'), l(31, 32, '30s'), l(32, 100, '7d')];
            expect(cacheProjection._distributeRangesToLayers(r, '10s')).to.deep.equal({
                F: spl(''), T: spl(''), B: spl('0 1 2 3 4 5 6 7')
            });
        });

    });
    describe("recompile()", ()=> {
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

        beforeEach(()=> {
            cacheProjection = new CacheProjection().setup('raw', levelIds);
            cacheProjection.projection = transpose(levelRanges);
        });


        it('basic example', ()=> {
            console.log(TestUtil.getRangeDrawing([cacheProjection.projection],null, 8));
            var diff = cacheProjection.recompile('30s', rng('2 8'));
            console.log(TestUtil.getRangeDrawing([cacheProjection.projection],null, 8));

        });
    });
});