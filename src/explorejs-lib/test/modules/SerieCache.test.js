//todo _getRangeOfDiff
//putDataAtLevel
import * as chai from 'chai';
import sinon from 'sinon';
import sinonChai from 'sinon-chai';
import {expect} from 'chai';
chai.use(sinonChai);

import SerieCache from "/modules/SerieCache";
import TestUtil from "explorejs-common/test/TestUtil";
import Range from 'explorejs-common/src/Range';
var ll = TestUtil.rangesOnLevel.bind(TestUtil);

var stream = TestUtil.dataFromStream.bind(TestUtil);

describe('SerieCache', () => {
    /**
     * @var {SerieCache}
     */
    var serieCache;
    beforeEach(()=> {
        serieCache = new SerieCache({serieId: "serie01"});
        //noinspection JSValidateTypes - mock
        serieCache.CacheManager = {
            RequestManager: {
                getManifestForSerie: function () {
                    return {
                        levels: [
                            {id: '10s', step: 10000},
                            {id: '1m', step: 60000},
                            {id: '10m', step: 600000},
                            {id: '1h', step: 3600000}
                        ]
                    }
                }
            }
        };
        serieCache.setup();
    });
    describe('_getRangeOfDiff()', ()=> {
        it('null case', ()=> {
            expect(serieCache._getRangeOfDiff(null)).to.be.null;
        });
        it('empty case', ()=> {
            expect(serieCache._getRangeOfDiff({added: [], removed: [], resized: []})).to.be.null;
        });
        it('semi-empty case', ()=> {
            expect(serieCache._getRangeOfDiff({
                added: [],
                removed: ll('1y 300 301'),
                resized: []
            })).to.deep.equal({left: 300, right: 301});
        });
        it('example case', ()=> {
            expect(serieCache._getRangeOfDiff({
                added: ll('10m 12 15; 1y 1000 1200'),
                removed: ll('10s 3 5;'),
                resized: ll('raw 40 50 40 45')
            })).to.deep.equal({left: 3, right: 1200});
        });
    });
    describe('putDataAtLevel() - integration', ()=> {
        var listeners;
        var expectedDiff;

        function setupTest(scale) {
            listeners = {
                $raw_unbounded: sinon.spy(),
                $raw_4_to_14: sinon.spy(),
                $10s_unbounded: sinon.spy(),
                $10s_4_to_14: sinon.spy(),
                $1m_unbounded: sinon.spy(),
                $1m_4_to_14: sinon.spy(),
                $10m_unbounded: sinon.spy(),
                $10m_4_to_14: sinon.spy(),
                $1h_unbounded: sinon.spy(),
                $1h_4_to_14: sinon.spy()
            };
            serieCache.getProjectionEventAtLevel('raw').addListener('recompile', Range.unbounded(), listeners.$raw_unbounded);
            serieCache.getProjectionEventAtLevel('raw').addListener('recompile', Range.leftClosed(4 * scale, 14 * scale), listeners.$raw_4_to_14);

            serieCache.getProjectionEventAtLevel('10s').addListener('recompile', Range.unbounded(), listeners.$10s_unbounded);
            serieCache.getProjectionEventAtLevel('10s').addListener('recompile', Range.leftClosed(4 * scale, 14 * scale), listeners.$10s_4_to_14);

            serieCache.getProjectionEventAtLevel('1m').addListener('recompile', Range.unbounded(), listeners.$1m_unbounded);
            serieCache.getProjectionEventAtLevel('1m').addListener('recompile', Range.leftClosed(4 * scale, 14 * scale), listeners.$1m_4_to_14);

            serieCache.getProjectionEventAtLevel('10m').addListener('recompile', Range.unbounded(), listeners.$10m_unbounded);
            serieCache.getProjectionEventAtLevel('10m').addListener('recompile', Range.leftClosed(4 * scale, 14 * scale), listeners.$10m_4_to_14);

            serieCache.getProjectionEventAtLevel('1h').addListener('recompile', Range.unbounded(), listeners.$1h_unbounded);
            serieCache.getProjectionEventAtLevel('1h').addListener('recompile', Range.leftClosed(4 * scale, 14 * scale), listeners.$1h_4_to_14);
        }

        /**
         * This test checks if right listeners at different levels are fired properly as the result of putting data at some cache level
         */
        it('base test', ()=> {

            setupTest(10000);

            serieCache.putDataAtLevel('10s', stream('10 11 0.4; 11 12 0.5; 12 13 0.5; 13 14 0.4', 10000));

            expectedDiff = {
                added: ll('10s 10 14;', 10000),
                removed: [],
                resized: []
            };
            expect(listeners.$raw_unbounded).to.be.calledOnce.calledWith(expectedDiff);
            expect(listeners.$raw_4_to_14).to.be.calledOnce.calledWith(expectedDiff);
            expect(listeners.$10s_unbounded).to.be.calledOnce.calledWith(expectedDiff);
            expect(listeners.$10s_4_to_14).to.be.calledOnce.calledWith(expectedDiff);
            expect(listeners.$1m_unbounded).to.be.not.called;
            expect(listeners.$1m_4_to_14).to.be.not.called;
            expect(listeners.$10m_unbounded).to.be.not.called;
            expect(listeners.$10m_4_to_14).to.be.not.called;
            expect(listeners.$1h_unbounded).to.be.not.called;
            expect(listeners.$1h_4_to_14).to.be.not.called;

            serieCache.putDataAtLevel('10s', stream('110 111 0.4; 111 112 0.5; 112 113 0.5; 113 114 0.4', 10000));

            expectedDiff = {
                added: ll('10s 110 114', 10000), removed: [], resized: []
            };

            expect(listeners.$raw_unbounded).to.be.calledTwice.calledWith(expectedDiff);
            expect(listeners.$raw_4_to_14).to.be.calledOnce; // range not overlap
            expect(listeners.$10s_unbounded).to.be.calledTwice.calledWith(expectedDiff);
            expect(listeners.$10s_4_to_14).to.be.calledOnce; // range not overlap
            expect(listeners.$1m_unbounded).to.be.not.called;
            expect(listeners.$1m_4_to_14).to.be.not.called;
            expect(listeners.$10m_unbounded).to.be.not.called;
            expect(listeners.$10m_4_to_14).to.be.not.called;
            expect(listeners.$1h_unbounded).to.be.not.called;
            expect(listeners.$1h_4_to_14).to.be.not.called;
        });
        /**
         * At this test we put some data at 1m, then put some data at 10s somewhere in the middle of existing range
         */
        it('different levels', ()=> {
            var scale10m = 10 * 60 * 1000;
            setupTest(scale10m);

            serieCache.putDataAtLevel('10m', stream('10 11 0.4; 11 12 0.5; 12 13 0.5; 13 14 0.4', scale10m));

            expectedDiff = {
                added: ll('10m 10 14;', scale10m),
                removed: [],
                resized: []
            };
            expect(listeners.$raw_unbounded).to.be.calledOnce.calledWith(expectedDiff);
            expect(listeners.$raw_4_to_14).to.be.calledOnce.calledWith(expectedDiff);
            expect(listeners.$10s_unbounded).to.be.calledOnce.calledWith(expectedDiff);
            expect(listeners.$10s_4_to_14).to.be.calledOnce.calledWith(expectedDiff);
            expect(listeners.$1m_unbounded).to.be.calledOnce.calledWith(expectedDiff);
            expect(listeners.$1m_4_to_14).to.be.calledOnce.calledWith(expectedDiff);
            expect(listeners.$10m_unbounded).to.be.calledOnce.calledWith(expectedDiff);
            expect(listeners.$10m_4_to_14).to.be.calledOnce.calledWith(expectedDiff);
            expect(listeners.$1h_unbounded).to.be.not.called;
            expect(listeners.$1h_4_to_14).to.be.not.called;

            serieCache.putDataAtLevel('1m', stream('12.1 12.2 0.8; 12.2 12.3 0.5; 12.3 12.4 0.7; 12.4 12.5 0.2', scale10m));


            expectedDiff = {
                added: ll('1m 12.1 12.5; 10m 12.5 14', scale10m),
                removed: ll(''),
                resized: ll('10m 10 12.1 10 14', scale10m)
            };
            expect(listeners.$raw_unbounded).calledWith(expectedDiff);
            expect(listeners.$raw_4_to_14).calledWith(expectedDiff);
            expect(listeners.$10s_unbounded).calledWith(expectedDiff);
            expect(listeners.$10s_4_to_14).calledWith(expectedDiff);
            expect(listeners.$1m_unbounded).calledWith(expectedDiff);
            expect(listeners.$1m_4_to_14).calledWith(expectedDiff);
            expect(listeners.$10m_unbounded).calledOnce;
            expect(listeners.$10m_4_to_14).calledOnce;
            expect(listeners.$1h_unbounded).not.called;
            expect(listeners.$1h_4_to_14).not.called;

            serieCache.putDataAtLevel('1h', stream('12 18 0.1', scale10m));


            var expectedDiffForFineLevels = {added: ll('1h 14 18', scale10m), removed: [], resized: []};
            expect(listeners.$raw_unbounded).calledWith(expectedDiffForFineLevels);
            expect(listeners.$raw_4_to_14).calledTwice;//listener not overlap
            expect(listeners.$10s_unbounded).calledWith(expectedDiffForFineLevels);
            expect(listeners.$10s_4_to_14).calledTwice;//listener not overlap
            expect(listeners.$1m_unbounded).calledWith(expectedDiffForFineLevels);
            expect(listeners.$1m_4_to_14).calledTwice;//listener not overlap
            expect(listeners.$10m_unbounded).calledWith(expectedDiffForFineLevels);
            expect(listeners.$10m_4_to_14).calledOnce;//listener not overlap
            var expectedDiffForCoarseLevels = {added: ll('1h 12 18', scale10m), removed: [], resized: []};
            expect(listeners.$1h_unbounded).calledWith(expectedDiffForCoarseLevels);
            expect(listeners.$1h_4_to_14).calledWith(expectedDiffForCoarseLevels);
        });
    });
});