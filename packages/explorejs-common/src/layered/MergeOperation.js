var DiffRangeSet = require('../DiffRangeSet');
module.exports = class MergeOperation {
    /**
     *
     * @param B
     * @param T
     * @param F
     * @param R
     * @param [copyFn]
     * @return {{T: *, B: *, R: *}}
     */
    static execute(B, T, F, R, copyFn) {
        // R - F1
        var R_sub_F1 = DiffRangeSet.subtract(R, F, null, null, null, null, copyFn);
        // T2 = (R-F1)+T1
        var T2Diff = DiffRangeSet.add(T, R_sub_F1.result, null, null, null, null, copyFn);
        // B2 = B1 - R
        var B2Diff = DiffRangeSet.subtract(B, R, null, null, null, null, copyFn);

        return {
            T: T2Diff,
            B: B2Diff,
            R: R_sub_F1
        };
    }

};
