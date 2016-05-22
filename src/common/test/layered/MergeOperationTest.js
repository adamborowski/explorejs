var expect = require("chai").expect;
var MergeOperation = require("../../src/layered/MergeOperation");
var TestUtil = require('../TestUtil');
var rng = TestUtil.rng;

function perform(config) {
    var F = rng(config.F);
    var T = rng(config.T);
    var B = rng(config.B);
    var R = rng(config.R);
    var rangeDrawing = TestUtil.getRangeDrawing([F, T, B, R], 'FTBR');
    console.log('\n\n>> Layer merge diff test\n');
    console.log(rangeDrawing);
    var diff = MergeOperation.execute(B, T, F, R);
    var resultDrawing = TestUtil.getRangeDrawing([F, diff.T.result, diff.B.result, diff.R.result], 'FTBR');
    console.log(resultDrawing);

    expect(diff).to.deep.equal({
        T: {
            added: rng(config.diff.T.added),
            removed: rng(config.diff.T.removed),
            resized: rng(config.diff.T.resized),
            result: rng(config.diff.T.result)
        },
        B: {
            added: rng(config.diff.B.added),
            removed: rng(config.diff.B.removed),
            resized: rng(config.diff.B.resized),
            result: rng(config.diff.B.result)
        },
        R: {
            added: rng(config.diff.R.added),
            removed: rng(config.diff.R.removed),
            resized: rng(config.diff.R.resized),
            result: rng(config.diff.R.result)
        }
    });
}


describe('MergeOperation', ()=> {
    it('example case', ()=> {
        /*
         ┌────────────────────────────────────────────────────────────────────────┐
         ├ F       ┏━━━━━━━━━━━┓     ┏━━━━━┓                                      │
         │         1           3     4     5                                      │
         ├ T                                           ┏━━━━━━━━━━━┓     ┏━━━━━┓  │
         │                                             7           9     10   11  │
         ├ B                               ┏━━━━━┓                 ┏━━━━━┓        │
         │                                 5     6                 9    10        │
         ├ R             ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓                    │
         │               2                                   8                    │
         └────────────────────────────────────────────────────────────────────────┘
         ┌────────────────────────────────────────────────────────────────────────┐
         ├ F       ┏━━━━━━━━━━━┓     ┏━━━━━┓                                      │
         │         1           3     4     5                                      │
         ├ T                   ┏━━━━━┓     ┏━━━━━━━━━━━━━━━━━━━━━━━┓     ┏━━━━━┓  │
         │                     3     4     5                       9     10   11  │
         ├ B                                                       ┏━━━━━┓        │
         │                                                         9    10        │
         ├ R                   ┏━━━━━┓     ┏━━━━━━━━━━━━━━━━━┓                    │
         │                     3     4     5                 8                    │
         └────────────────────────────────────────────────────────────────────────┘
         */
        perform({
            F: '1 3 4 5', T: '7 9 10 11', B: '5 6 9 10', R: '2 8',
            diff: {
                T: {added: '3 4', removed: '', resized: '[7->5 9]', result: '3 4 [7->5 9] [10 11]'},
                B: {added: '', removed: '5 6', resized: '', result: '[9 10]'},
                R: {added: '5 8', removed: '', resized: '[2->3 8->4]', result: '[2->3 8->4] 5 8'}
            }
        });
    });
    it('back empty, front some, this empty => add covering range', ()=> {
        /*
         ┌────────────────────────────────────────────────┐
         ├ F       ┏━━━━━┓     ┏━━━━━┓     ┏━━━━━┓        │
         │         1     2     3     4     5     6        │
         ├ T                                              │
         │                                                │
         ├ B                                              │
         │                                                │
         ├ R ┏━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━┓  │
         │   0                                         7  │
         └────────────────────────────────────────────────┘
         ┌────────────────────────────────────────────────┐
         ├ F       ┏━━━━━┓     ┏━━━━━┓     ┏━━━━━┓        │
         │         1     2     3     4     5     6        │
         ├ T ┏━━━━━┓     ┏━━━━━┓     ┏━━━━━┓     ┏━━━━━┓  │
         │   0     1     2     3     4     5     6     7  │
         ├ B                                              │
         │                                                │
         ├ R ┏━━━━━┓     ┏━━━━━┓     ┏━━━━━┓     ┏━━━━━┓  │
         │   0     1     2     3     4     5     6     7  │
         └────────────────────────────────────────────────┘
         */
        perform({
            F: '1 2 3 4 5 6', T: '', B: '', R: '0 7',
            diff: {
                T: {added: '0 1 2 3 4 5 6 7', removed: '', resized: '', result: '0 1 2 3 4 5 6 7'},
                B: {added: '', removed: '', resized: '', result: ''},
                R: {added: '2 3 4 5 6 7', removed: '', resized: '[0 7->1]', result: '[0 7->1] 2 3 4 5 6 7'}
            }
        });
    });
    it('not overlapping', ()=> {
        /*
         */
        perform({
            F: '1 2', T: '3 4', B: '5 6', R: '7 8',
            diff: {
                T: {added: '7 8', removed: '', resized: '', result: '[3 4] 7 8'},
                B: {added: '', removed: '', resized: '', result: '[5 6]'},
                R: {added: '', removed: '', resized: '', result: '[7 8]'}
            }
        });
    });
    it('not overlapping, touching', ()=> {
        /*
         */
        perform({
            F: '1 3', T: '3 5', B: '5 7', R: '7 8',
            diff: {
                T: {added: '7 8', removed: '', resized: '', result: '[3 5] 7 8'},
                B: {added: '', removed: '', resized: '', result: '[5 7]'},
                R: {added: '', removed: '', resized: '', result: '[7 8]'}
            }
        });
    });
    it('overlapping one part from front and one part from back', ()=> {
        /*
         */
        perform({
            F: '1 3', T: '', B: '5 7', R: '2 6',
            diff: {
                T: {added: '3 6', removed: '', resized: '', result: '3 6'},
                B: {added: '', removed: '', resized: '[5->6 7]', result: '[5->6 7]'},
                R: {added: '', removed: '', resized: '[2->3 6]', result: '[2->3 6]'}
            }
        });
    });
    it('front is empty, target will join existing target and will cover all back', ()=> {
        /*
         */
        perform({
            F: '', T: '2 4', B: '0 2 4 5 6 8 9 11', R: '0 12',
            diff: {
                T: {added: '', removed: '', resized: '[2->0 4->12]', result: '[2->0 4->12]'},
                B: {added: '', removed: '0 2 4 5 6 8 9 11', resized: '', result: ''},
                R: {added: '', removed: '', resized: '', result: '[0 12]'}
            }
        });
    });
    //TODO: randomized tests
    /**
     * 1. get next range (draw new length, sets are touching previous)
     * 2. draw layer to assign it.
     *
     * 3. get results
     * 4. use qintervals to build the projection (B=B-T-T1-F, T = T+T1 - F, F=F) and deeply compare
     */
});