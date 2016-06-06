import * as chai from 'chai';
var expect = chai.expect;
import {Builder as DisposerBuilder} from "/modules/SerieCacheProjectionDisposer";
import TestUtil from "explorejs-common/test/TestUtil";
chai.use(require('chai-things'));
var rng = TestUtil.rng;
var m = require('hamjest');

function containsWithProperties(...objects) {
    return m.contains.apply(m, objects.map(o=>m.hasProperties(o)));
}

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