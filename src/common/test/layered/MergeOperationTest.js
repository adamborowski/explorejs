var expect = require("chai").expect;
var MergeOperation = require("../../src/layered/MergeOperation");
var TestUtil = require('../TestUtil');
var rng = TestUtil.rng;
describe('MergeOperation', ()=> {
    it('example case', ()=> {
        /*
         *
         *  F:    ┏━━━━━━━┓   ┏━━━┓
         *  T:                            ┏━━━━━━━┓   ┏━━━┓
         *  B:                ┏━━━┓               ┏━━━┓
         *  R:        ┏━━━━━━━━━━━━━━━━━━━━━━━┓
         *
         *    │   │   │   │   │   │   │   │   │   │   │   │
         *│   0   1   2   3   4   5   6   7   8   9   10  11
         *
         */
        var F = rng('1 3 4 5');
        var T = rng('7 9 10 11');
        var B = rng('5 6 9 10');
        var R = rng('2 8');

        var diff = MergeOperation.execute(B, T, F, R);
        console.log(diff);
        expect(diff).to.be.null;
    });
});