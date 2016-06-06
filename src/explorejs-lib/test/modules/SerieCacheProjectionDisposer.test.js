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
var m = require('hamjest');

function containsWithProperties(...objects) {
    return m.contains.apply(m, objects.map(o=>m.hasProperties(o)));
}

describe("SerieCacheProjectionDisposer", ()=> {
    var disposer;
    beforeEach(()=> {
        disposer = new Disposer(['raw', '10s', '30s', '1m', '30m', '1h', '1d', '30d', '1y'].map(a=>({
            levelId: a,
            recompile: sinon.spy()
        })));
    });

    it('recompile at raw', ()=> {
        disposer.recompile('raw', []);
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
    it('recompile at 10s', ()=> {
        disposer.recompile('10s', []);
        expect(disposer.getProjection('raw').recompile).to.have.not.been.called;
        expect(disposer.getProjection('10s').recompile).to.have.been.calledOnce;
        expect(disposer.getProjection('30s').recompile).to.have.been.calledOnce;
        expect(disposer.getProjection('1m').recompile).to.have.been.calledOnce;
        expect(disposer.getProjection('30m').recompile).to.have.been.calledOnce;
        expect(disposer.getProjection('1h').recompile).to.have.been.calledOnce;
        expect(disposer.getProjection('1d').recompile).to.have.been.calledOnce;
        expect(disposer.getProjection('30d').recompile).to.have.been.calledOnce;
        expect(disposer.getProjection('1y').recompile).to.have.been.calledOnce;
    });
    it('recompile at 30s', ()=> {
        disposer.recompile('30s', []);
        expect(disposer.getProjection('raw').recompile).to.have.not.been.called;
        expect(disposer.getProjection('10s').recompile).to.have.not.been.called;
        expect(disposer.getProjection('30s').recompile).to.have.been.calledOnce;
        expect(disposer.getProjection('1m').recompile).to.have.been.calledOnce;
        expect(disposer.getProjection('30m').recompile).to.have.been.calledOnce;
        expect(disposer.getProjection('1h').recompile).to.have.been.calledOnce;
        expect(disposer.getProjection('1d').recompile).to.have.been.calledOnce;
        expect(disposer.getProjection('30d').recompile).to.have.been.calledOnce;
        expect(disposer.getProjection('1y').recompile).to.have.been.calledOnce;
    });
    it('recompile at 1m', ()=> {
        disposer.recompile('1m', []);
        expect(disposer.getProjection('raw').recompile).to.have.not.been.called;
        expect(disposer.getProjection('10s').recompile).to.have.not.been.called;
        expect(disposer.getProjection('30s').recompile).to.have.not.been.called;
        expect(disposer.getProjection('1m').recompile).to.have.been.calledOnce;
        expect(disposer.getProjection('30m').recompile).to.have.been.calledOnce;
        expect(disposer.getProjection('1h').recompile).to.have.been.calledOnce;
        expect(disposer.getProjection('1d').recompile).to.have.been.calledOnce;
        expect(disposer.getProjection('30d').recompile).to.have.been.calledOnce;
        expect(disposer.getProjection('1y').recompile).to.have.been.calledOnce;
    });
    it('recompile at 30m', ()=> {
        disposer.recompile('30m', []);
        expect(disposer.getProjection('raw').recompile).to.have.not.been.called;
        expect(disposer.getProjection('10s').recompile).to.have.not.been.called;
        expect(disposer.getProjection('30s').recompile).to.have.not.been.called;
        expect(disposer.getProjection('1m').recompile).to.have.not.been.called;
        expect(disposer.getProjection('30m').recompile).to.have.been.calledOnce;
        expect(disposer.getProjection('1h').recompile).to.have.been.calledOnce;
        expect(disposer.getProjection('1d').recompile).to.have.been.calledOnce;
        expect(disposer.getProjection('30d').recompile).to.have.been.calledOnce;
        expect(disposer.getProjection('1y').recompile).to.have.been.calledOnce;
    });
    it('recompile at 1h', ()=> {
        disposer.recompile('1h', []);
        expect(disposer.getProjection('raw').recompile).to.have.not.been.called;
        expect(disposer.getProjection('10s').recompile).to.have.not.been.called;
        expect(disposer.getProjection('30s').recompile).to.have.not.been.called;
        expect(disposer.getProjection('1m').recompile).to.have.not.been.called;
        expect(disposer.getProjection('30m').recompile).to.have.not.been.called;
        expect(disposer.getProjection('1h').recompile).to.have.been.calledOnce;
        expect(disposer.getProjection('1d').recompile).to.have.been.calledOnce;
        expect(disposer.getProjection('30d').recompile).to.have.been.calledOnce;
        expect(disposer.getProjection('1y').recompile).to.have.been.calledOnce;
    });
    it('recompile at 1d', ()=> {
        disposer.recompile('1d', []);
        expect(disposer.getProjection('raw').recompile).to.have.not.been.called;
        expect(disposer.getProjection('10s').recompile).to.have.not.been.called;
        expect(disposer.getProjection('30s').recompile).to.have.not.been.called;
        expect(disposer.getProjection('1m').recompile).to.have.not.been.called;
        expect(disposer.getProjection('30m').recompile).to.have.not.been.called;
        expect(disposer.getProjection('1h').recompile).to.have.not.been.called;
        expect(disposer.getProjection('1d').recompile).to.have.been.calledOnce;
        expect(disposer.getProjection('30d').recompile).to.have.been.calledOnce;
        expect(disposer.getProjection('1y').recompile).to.have.been.calledOnce;
    });
    it('recompile at 30d', ()=> {
        disposer.recompile('30d', []);
        expect(disposer.getProjection('raw').recompile).to.have.not.been.called;
        expect(disposer.getProjection('10s').recompile).to.have.not.been.called;
        expect(disposer.getProjection('30s').recompile).to.have.not.been.called;
        expect(disposer.getProjection('1m').recompile).to.have.not.been.called;
        expect(disposer.getProjection('30m').recompile).to.have.not.been.called;
        expect(disposer.getProjection('1h').recompile).to.have.not.been.called;
        expect(disposer.getProjection('1d').recompile).to.have.not.been.called;
        expect(disposer.getProjection('30d').recompile).to.have.been.calledOnce;
        expect(disposer.getProjection('1y').recompile).to.have.been.calledOnce;
    });
    it('recompile at 1y', ()=> {
        disposer.recompile('1y', []);
        expect(disposer.getProjection('raw').recompile).to.have.not.been.called;
        expect(disposer.getProjection('10s').recompile).to.have.not.been.called;
        expect(disposer.getProjection('30s').recompile).to.have.not.been.called;
        expect(disposer.getProjection('1m').recompile).to.have.not.been.called;
        expect(disposer.getProjection('30m').recompile).to.have.not.been.called;
        expect(disposer.getProjection('1h').recompile).to.have.not.been.called;
        expect(disposer.getProjection('1d').recompile).to.have.not.been.called;
        expect(disposer.getProjection('30d').recompile).to.have.not.been.called;
        expect(disposer.getProjection('1y').recompile).to.have.been.calledOnce;
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