//todo _getRangeOfDiff
//putDataAtLevel
import chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import {expect} from 'chai';
import Range from "explorejs-common/src/Range";
chai.use(sinonChai);

import LevelCache from "../../src/modules/LevelCache";
import TestUtil from "explorejs-common/test/TestUtil";
import DataRequest from "../../src/data/DataRequest";
var rng = TestUtil.rng;
var l = TestUtil.rangeOnLevel;
var ll = TestUtil.rangesOnLevel.bind(TestUtil);
describe('LevelCache', () => {
    /**
     * @var {LevelCache}
     */
    var levelCache;
    var scale;
    var addRequestSpy;
    var setupTest = (level)=> {
        levelCache = new LevelCache(level);
        scale = level.span;
        addRequestSpy = sinon.spy();
        //noinspection JSValidateTypes - mock
        levelCache.SerieCache = {
            options: {serieId: 'foo123'},
            CacheManager: {RequestManager: {addRequest: addRequestSpy}}
        };
        levelCache.setup();
    };

    function sdata(dataStr) {
        return dataStr.split(';').map(p=> {
            var d = p.trim().split(' ');
            if (d.length == 3) {
                return {$s: Number(d[0]) * scale, $e: Number(d[1]) * scale, v: Number(d[2])}
            }
            if (d.length == 2) {
                return {$t: Number(d[0]) * scale, v: Number(d[1])}
            }
            throw new RangeError('bad format');
        });
    }

    function srng(dataStr) {
        return dataStr.split(';').map(p=> {
            var d = p.trim().split(' ');
            if (d.length == 2) {
                return {start: Number(d[0]) * scale, end: Number(d[1]) * scale}
            }
        });
    }

    describe('putData()', ()=> {
        it('example case', ()=> {
            setupTest({id: '10s', span: 10000});
            levelCache.putData(sdata('1 2 101; 2 3 131; 3 4 129; 4 5 136'));
            expect(levelCache._dataIndex.toObjects('start', 'end')).to.deep.equal(srng('1 5'));
            expect(levelCache._segmentArray._data).to.deep.equal(sdata('1 2 101; 2 3 131; 3 4 129; 4 5 136'));
        });
        it('put same range case', ()=> {
            setupTest({id: '10s', span: 10000});
            levelCache.putData(sdata('1 2 101; 2 3 131; 3 4 129; 4 5 136'));
            levelCache.putData(sdata('1 2 101; 2 3 131; 3 4 129; 4 5 136'));
            expect(levelCache._dataIndex.toObjects('start', 'end')).to.deep.equal(srng('1 5'));
            expect(levelCache._segmentArray._data).to.deep.equal(sdata('1 2 101; 2 3 131; 3 4 129; 4 5 136'));
        });
        it('put same range case, value override', ()=> {
            setupTest({id: '10s', span: 10000});
            levelCache.putData(sdata('1 2 101; 2 3 131; 3 4 129; 4 5 136'));
            levelCache.putData(sdata('1 2 201; 2 3 231; 3 4 229; 4 5 236'));
            expect(levelCache._dataIndex.toObjects('start', 'end')).to.deep.equal(srng('1 5'));
            expect(levelCache._segmentArray._data).to.deep.equal(sdata('1 2 201; 2 3 231; 3 4 229; 4 5 236'));
        });
        it('put similar range case', ()=> {
            setupTest({id: '10s', span: 10000});
            levelCache.putData(sdata('1 2 101; 2 3 131; 3 4 129; 4 5 136'));
            levelCache.putData(sdata('2 3 131; 3 4 129; 4 5 136; 5 6 123'));
            expect(levelCache._dataIndex.toObjects('start', 'end')).to.deep.equal(srng('1 6'));
            expect(levelCache._segmentArray._data).to.deep.equal(sdata('1 2 101; 2 3 131; 3 4 129; 4 5 136; 5 6 123'));
        });
        it('put similar range case, value override', ()=> {
            setupTest({id: '10s', span: 10000});
            levelCache.putData(sdata('1 2 101; 2 3 131; 3 4 129; 4 5 136'));
            levelCache.putData(sdata('2 3 131; 3 4 329; 4 5 136; 5 6 123'));
            expect(levelCache._dataIndex.toObjects('start', 'end')).to.deep.equal(srng('1 6'));
            expect(levelCache._segmentArray._data).to.deep.equal(sdata('1 2 101; 2 3 131; 3 4 329; 4 5 136; 5 6 123'));
        });
        it('combined case', ()=> {
            setupTest({id: '10s', span: 10000});
            levelCache.putData(sdata('1 2 101; 2 3 131; 3 4 129; 4 5 136'));
            levelCache.putData(sdata('2 3 131; 3 4 129; 4 5 136; 5 6 123'));
            levelCache.putData(sdata('11 12 1112; 12 13 1213; 13 14 1314; 14 15 1415'));
            expect(levelCache._dataIndex.toObjects('start', 'end')).to.deep.equal(srng('1 6; 11 15'));
            expect(levelCache._segmentArray._data).to.deep.equal(sdata('1 2 101; 2 3 131; 3 4 129; 4 5 136; 5 6 123; 11 12 1112; 12 13 1213; 13 14 1314; 14 15 1415'));
        });
    });
    describe('requestDataForRange()', ()=> {
        it('example case', ()=> {
            setupTest({id: '10s', span: 10000});
            levelCache.putData(sdata('1 2 101; 2 3 131; 3 4 129; 4 5 136'));

            expect(levelCache.requestDataForRange(Range.closed(3 * scale, 7 * scale))).to.deep.equal(srng('5 7'));

            expect(addRequestSpy).calledOnce.calledWith(new DataRequest('foo123', '10s', 5 * scale, 7 * scale, 1));
        });
        it('combined case', ()=> {
            setupTest({id: '10s', span: 10000});
            levelCache.putData(sdata('1 2 101; 2 3 131; 3 4 129; 4 5 136'));
            levelCache.putData(sdata('2 3 131; 3 4 129; 4 5 136; 5 6 123'));
            levelCache.putData(sdata('11 12 1112; 12 13 1213; 13 14 1314; 14 15 1415'));

            expect(levelCache.requestDataForRange(Range.closed(0 * scale, 20 * scale))).to.deep.equal(srng('0 1; 6 11; 15 20'));

            expect(addRequestSpy).calledThrice;
            expect(addRequestSpy).calledWith(new DataRequest('foo123', '10s', 0 * scale, 1 * scale, 1));
            expect(addRequestSpy).calledWith(new DataRequest('foo123', '10s', 6 * scale, 11 * scale, 1));
            expect(addRequestSpy).calledWith(new DataRequest('foo123', '10s', 15 * scale, 20 * scale, 1));

        });
        it('request for non-cached fragment', ()=> {
            setupTest({id: '10s', span: 10000});
            levelCache.putData(sdata('1 2 101; 2 3 131; 3 4 129; 4 5 136'));
            levelCache.putData(sdata('2 3 131; 3 4 129; 4 5 136; 5 6 123'));
            levelCache.putData(sdata('11 12 1112; 12 13 1213; 13 14 1314; 14 15 1415'));

            expect(levelCache.requestDataForRange(Range.closed(18 * scale, 20 * scale))).to.deep.equal(srng('18 20'));

            expect(addRequestSpy).calledOnce;
            expect(addRequestSpy).calledWith(new DataRequest('foo123', '10s', 18 * scale, 20 * scale, 1));
        });
        it('request for fully-existing fragment', ()=> {
            setupTest({id: '10s', span: 10000});
            levelCache.putData(sdata('1 2 101; 2 3 131; 3 4 129; 4 5 136'));
            levelCache.putData(sdata('2 3 131; 3 4 129; 4 5 136; 5 6 123'));
            levelCache.putData(sdata('11 12 1112; 12 13 1213; 13 14 1314; 14 15 1415'));

            expect(levelCache.requestDataForRange(Range.closed(3 * scale, 6 * scale))).to.be.empty;

            expect(addRequestSpy).not.called;
        });
    });
});