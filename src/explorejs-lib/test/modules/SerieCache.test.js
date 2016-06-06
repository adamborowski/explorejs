//todo _getRangeOfDiff
//putDataAtLevel
import * as chai from 'chai';
var expect = chai.expect;
import SerieCache from "/modules/SerieCache";
import TestUtil from "explorejs-common/test/TestUtil";
var rng = TestUtil.rng;
var l = TestUtil.rangeOnLevel;
var ll = TestUtil.rangesOnLevel.bind(TestUtil);
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
    describe('putDataAtLevel()', ()=> {

    });
});