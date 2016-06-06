import * as chai from 'chai';
var sinon = require("sinon");
var sinonChai = require("sinon-chai");
var expect = chai.expect;
import {Builder as DisposerBuilder} from "/modules/SerieCacheProjectionDisposer";
import Disposer from "/modules/SerieCacheProjectionDisposer";
import TestUtil from "explorejs-common/test/TestUtil";
chai.use(require('chai-things'));
chai.use(sinonChai);
var rng = TestUtil.rng;
var ll = TestUtil.rangesOnLevel.bind(TestUtil);
var m = require('hamjest');

function containsWithProperties(...objects) {
    return m.contains.apply(m, objects.map(o=>m.hasProperties(o)));
}

describe("SerieCacheProjectionDisposer", ()=> {
    var disposer;
    describe('recompile at different levels', ()=> {
        beforeEach(()=> {
            disposer = new Disposer(['raw', '10s', '30s', '1m', '30m', '1h', '1d', '30d', '1y'].map(a=>({
                levelId: a,
                recompile: sinon.spy()
            })));
        });

        it('recompile at raw', ()=> {
            disposer.recompile('raw', []);
            expect(disposer.getProjection('raw').recompile).to.have.been.calledOnce;
            expect(disposer.getProjection('10s').recompile).to.have.not.been.called;
            expect(disposer.getProjection('30s').recompile).to.have.not.been.called;
            expect(disposer.getProjection('1m').recompile).to.have.not.been.called;
            expect(disposer.getProjection('30m').recompile).to.have.not.been.called;
            expect(disposer.getProjection('1h').recompile).to.have.not.been.called;
            expect(disposer.getProjection('1d').recompile).to.have.not.been.called;
            expect(disposer.getProjection('30d').recompile).to.have.not.been.called;
            expect(disposer.getProjection('1y').recompile).to.have.not.been.called;
        });
        it('recompile at 10s', ()=> {
            disposer.recompile('10s', []);
            expect(disposer.getProjection('raw').recompile).to.have.been.calledOnce;
            expect(disposer.getProjection('10s').recompile).to.have.been.calledOnce;
            expect(disposer.getProjection('30s').recompile).to.have.not.been.called;
            expect(disposer.getProjection('1m').recompile).to.have.not.been.called;
            expect(disposer.getProjection('30m').recompile).to.have.not.been.called;
            expect(disposer.getProjection('1h').recompile).to.have.not.been.called;
            expect(disposer.getProjection('1d').recompile).to.have.not.been.called;
            expect(disposer.getProjection('30d').recompile).to.have.not.been.called;
            expect(disposer.getProjection('1y').recompile).to.have.not.been.called;
        });
        it('recompile at 30s', ()=> {
            disposer.recompile('30s', []);
            expect(disposer.getProjection('raw').recompile).to.have.been.calledOnce;
            expect(disposer.getProjection('10s').recompile).to.have.been.calledOnce;
            expect(disposer.getProjection('30s').recompile).to.have.been.calledOnce;
            expect(disposer.getProjection('1m').recompile).to.have.not.been.called;
            expect(disposer.getProjection('30m').recompile).to.have.not.been.called;
            expect(disposer.getProjection('1h').recompile).to.have.not.been.called;
            expect(disposer.getProjection('1d').recompile).to.have.not.been.called;
            expect(disposer.getProjection('30d').recompile).to.have.not.been.called;
            expect(disposer.getProjection('1y').recompile).to.have.not.been.called;
        });
        it('recompile at 1m', ()=> {
            disposer.recompile('1m', []);
            expect(disposer.getProjection('raw').recompile).to.have.been.calledOnce;
            expect(disposer.getProjection('10s').recompile).to.have.been.calledOnce;
            expect(disposer.getProjection('30s').recompile).to.have.been.calledOnce;
            expect(disposer.getProjection('1m').recompile).to.have.been.calledOnce;
            expect(disposer.getProjection('30m').recompile).to.have.not.been.called;
            expect(disposer.getProjection('1h').recompile).to.have.not.been.called;
            expect(disposer.getProjection('1d').recompile).to.have.not.been.called;
            expect(disposer.getProjection('30d').recompile).to.have.not.been.called;
            expect(disposer.getProjection('1y').recompile).to.have.not.been.called;
        });
        it('recompile at 10m', ()=> {
            disposer.recompile('30m', []);
            expect(disposer.getProjection('raw').recompile).to.have.been.calledOnce;
            expect(disposer.getProjection('10s').recompile).to.have.been.calledOnce;
            expect(disposer.getProjection('30s').recompile).to.have.been.calledOnce;
            expect(disposer.getProjection('1m').recompile).to.have.been.calledOnce;
            expect(disposer.getProjection('30m').recompile).to.have.been.calledOnce;
            expect(disposer.getProjection('1h').recompile).to.have.not.been.called;
            expect(disposer.getProjection('1d').recompile).to.have.not.been.called;
            expect(disposer.getProjection('30d').recompile).to.have.not.been.called;
            expect(disposer.getProjection('1y').recompile).to.have.not.been.called;
        });
        it('recompile at 1h', ()=> {
            disposer.recompile('1h', []);
            expect(disposer.getProjection('raw').recompile).to.have.been.calledOnce;
            expect(disposer.getProjection('10s').recompile).to.have.been.calledOnce;
            expect(disposer.getProjection('30s').recompile).to.have.been.calledOnce;
            expect(disposer.getProjection('1m').recompile).to.have.been.calledOnce;
            expect(disposer.getProjection('30m').recompile).to.have.been.calledOnce;
            expect(disposer.getProjection('1h').recompile).to.have.been.calledOnce;
            expect(disposer.getProjection('1d').recompile).to.have.not.been.called;
            expect(disposer.getProjection('30d').recompile).to.have.not.been.called;
            expect(disposer.getProjection('1y').recompile).to.have.not.been.called;
        });
        it('recompile at 1d', ()=> {
            disposer.recompile('1d', []);
            expect(disposer.getProjection('raw').recompile).to.have.been.calledOnce;
            expect(disposer.getProjection('10s').recompile).to.have.been.calledOnce;
            expect(disposer.getProjection('30s').recompile).to.have.been.calledOnce;
            expect(disposer.getProjection('1m').recompile).to.have.been.calledOnce;
            expect(disposer.getProjection('30m').recompile).to.have.been.calledOnce;
            expect(disposer.getProjection('1h').recompile).to.have.been.calledOnce;
            expect(disposer.getProjection('1d').recompile).to.have.been.calledOnce;
            expect(disposer.getProjection('30d').recompile).to.have.not.been.called;
            expect(disposer.getProjection('1y').recompile).to.have.not.been.called;
        });
        it('recompile at 30d', ()=> {
            disposer.recompile('30d', []);
            expect(disposer.getProjection('raw').recompile).to.have.been.calledOnce;
            expect(disposer.getProjection('10s').recompile).to.have.been.calledOnce;
            expect(disposer.getProjection('30s').recompile).to.have.been.calledOnce;
            expect(disposer.getProjection('1m').recompile).to.have.been.calledOnce;
            expect(disposer.getProjection('30m').recompile).to.have.been.calledOnce;
            expect(disposer.getProjection('1h').recompile).to.have.been.calledOnce;
            expect(disposer.getProjection('1d').recompile).to.have.been.calledOnce;
            expect(disposer.getProjection('30d').recompile).to.have.been.calledOnce;
            expect(disposer.getProjection('1y').recompile).to.have.not.been.called;
        });
        it('recompile at 1y', ()=> {
            disposer.recompile('1y', []);
            expect(disposer.getProjection('raw').recompile).to.have.been.calledOnce;
            expect(disposer.getProjection('10s').recompile).to.have.been.calledOnce;
            expect(disposer.getProjection('30s').recompile).to.have.been.calledOnce;
            expect(disposer.getProjection('1m').recompile).to.have.been.calledOnce;
            expect(disposer.getProjection('30m').recompile).to.have.been.calledOnce;
            expect(disposer.getProjection('1h').recompile).to.have.been.calledOnce;
            expect(disposer.getProjection('1d').recompile).to.have.been.calledOnce;
            expect(disposer.getProjection('30d').recompile).to.have.been.calledOnce;
            expect(disposer.getProjection('1y').recompile).to.have.been.calledOnce;
        });
    });
    it('recompile example scenario', ()=> {
        disposer = new DisposerBuilder().withLevelIds(['raw', '10s', '30s', '1m', '30m', '1h', '1d', '30d', '1y']).build();
        disposer.recompile('1y', rng('10 15'));
        disposer.recompile('raw', rng('9 11'));
        disposer.recompile('30m', rng('0 3'));
        disposer.recompile('1h', rng('0 3'));
        disposer.recompile('1d', rng('0 4'));
        disposer.recompile('raw', rng('0 4'));
        disposer.recompile('30d', rng('11 15'));
        disposer.recompile('10s', rng('11 14'));
        disposer.recompile('30s', rng('0 8'));
        disposer.recompile('30m', rng('17 19'));
        disposer.recompile('raw', rng('18 20'));
        disposer.recompile('1y', rng('9 20'));

        expect(disposer.getProjection('1y').projection).to.deep.equal(ll('1y 9 20'));
        expect(disposer.getProjection('30d').projection).to.deep.equal(ll('1y 9 11; 30d 11 15; 1y 15 20'));
        expect(disposer.getProjection('1d').projection).to.deep.equal(ll('1d 0 4; 1y 9 11; 30d 11 15; 1y 15 20'));
        expect(disposer.getProjection('1h').projection).to.deep.equal(ll('1h 0 3; 1d 3 4; 1y 9 11; 30d 11 15; 1y 15 20'));
        expect(disposer.getProjection('30m').projection).to.deep.equal(ll('30m 0 3; 1d 3 4; 1y 9 11; 30d 11 15; 1y 15 17; 30m 17 19; 1y 19 20'));
        expect(disposer.getProjection('1m').projection).to.deep.equal(ll('30m 0 3; 1d 3 4; 1y 9 11; 30d 11 15; 1y 15 17; 30m 17 19; 1y 19 20'));
        expect(disposer.getProjection('30s').projection).to.deep.equal(ll('30s 0 8; 1y 9 11; 30d 11 15; 1y 15 17; 30m 17 19; 1y 19 20'));
        expect(disposer.getProjection('10s').projection).to.deep.equal(ll('30s 0 8; 1y 9 11; 10s 11 14; 30d 14 15; 1y 15 17; 30m 17 19; 1y 19 20'));
        expect(disposer.getProjection('raw').projection).to.deep.equal(ll('raw 0 4; 30s 4 8; raw 9 11; 10s 11 14; 30d 14 15; 1y 15 17; 30m 17 18; raw 18 20'));

        console.log(TestUtil.getRangeDrawing(disposer.projections.map(a=>a.projection), disposer.cacheLevelIds, 8))


    });
});

describe("SerieCacheProjectionDisposer.Builder", () => {
    it('base example', ()=> {
        var disposer = new DisposerBuilder().withLevelIds(['raw', '10s', '30s', '1m', '30m', '1h', '1d', '30d', '1y']).build();
        m.assertThat(disposer.projections, containsWithProperties(
            {
                levelId: m.equalTo('raw'),
                levelIds: m.equalTo(['raw', '10s', '30s', '1m', '30m', '1h', '1d', '30d', '1y'])
            },
            {
                levelId: m.equalTo('10s'),
                levelIds: m.equalTo(['10s', '30s', '1m', '30m', '1h', '1d', '30d', '1y'])
            },
            {
                levelId: m.equalTo('30s'),
                levelIds: m.equalTo(['30s', '1m', '30m', '1h', '1d', '30d', '1y'])
            },
            {
                levelId: m.equalTo('1m'),
                levelIds: m.equalTo(['1m', '30m', '1h', '1d', '30d', '1y'])
            },
            {
                levelId: m.equalTo('30m'),
                levelIds: m.equalTo(['30m', '1h', '1d', '30d', '1y'])
            },
            {
                levelId: m.equalTo('1h'),
                levelIds: m.equalTo(['1h', '1d', '30d', '1y'])
            },
            {
                levelId: m.equalTo('1d'),
                levelIds: m.equalTo(['1d', '30d', '1y'])
            },
            {
                levelId: m.equalTo('30d'),
                levelIds: m.equalTo(['30d', '1y'])
            },
            {
                levelId: m.equalTo('1y'),
                levelIds: m.equalTo(['1y'])
            }
        ));
    });
});