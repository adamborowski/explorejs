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
            })).to.deep.equal({start: 300, end: 301});
        });
        it('example case', ()=> {
            expect(serieCache._getRangeOfDiff({
                added: ll('10m 12 15; 1y 1000 1200'),
                removed: ll('10s 3 5;'),
                resized: ll('raw 40 50 40 45')
            })).to.deep.equal({start: 3, end: 1200});
        });
    });
    describe('putDataAtLevel() - integration', ()=> {
        var listeners;

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
        };
        it('base test', ()=> {

            setupTest(60 * 1000);

            serieCache.putDataAtLevel('1m', stream('10 11 0.4; 11 12 0.5; 12 13 0.5; 13 14 0.4', 60 * 1000));

            expect(listeners.$raw_unbounded).to.be.not.called;
            expect(listeners.$raw_4_to_14).to.be.not.called;
            expect(listeners.$10s_unbounded).to.be.not.called;
            expect(listeners.$10s_4_to_14).to.be.not.called;
            expect(listeners.$1m_unbounded).to.be.calledOnce;
            expect(listeners.$1m_4_to_14).to.be.calledOnce;
            expect(listeners.$10m_unbounded).to.be.calledOnce;
            expect(listeners.$10m_4_to_14).to.be.calledOnce;
            expect(listeners.$1h_unbounded).to.be.calledOnce;
            expect(listeners.$1h_4_to_14).to.be.calledOnce.calledWith(4, 4, 5);

        })
    });
});