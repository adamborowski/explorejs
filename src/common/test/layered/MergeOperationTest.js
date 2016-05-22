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

        var rangeDrawing = TestUtil.getRangeDrawing(F, T, B, R);
        console.log(rangeDrawing);

        var diff = MergeOperation.execute(B, T, F, R);
    });
    it('example case2', ()=> {
        /*
         ┌─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
         ├ F          ┏━━━━━━━━━┓         ┏━━━━━━━━━┓         ┏━━━━━━━━━┓
         │            1         2         3         4         5         6
         ├ T          ┏━━━━━━━━━━━━━━━━━━━┓         ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┳━━━━━━━━━━━━━━━━━━━┓
         │            1                   3         4                                                                              12                  14
         ├ B          ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
         │            1                                                 6
         ├ R          ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓
         │            1                                                                                                                                14
         └─────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────────
         */
        var F = rng('1 2 3 4 5 6');
        var T = rng('0 3 4 12 12 14');
        var B = rng('1 6');
        var R = rng('1 14');

        var rangeDrawing = TestUtil.getRangeDrawing([F, T, B, R], 'FTBR', 10);
        console.log(rangeDrawing);

        var diff = MergeOperation.execute(B, T, F, R);
    });
});