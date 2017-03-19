const OrderedSegmentArray = require('./OrderedSegmentArray');
const DiffRangeSet = require('./DiffRangeSet');
/**
 *  Add, subtract and diff (added, resized, removed) operation implementation for huge arrays
 *  This means that diff operations will be performed in narrower boundaries, based on common boundaries binary search
 *  @typedef {{start, end}} RangeType
 */
class DiffRangeSetOperation {
    /**
     * Adds argument to subject
     * @param subject {RangeType[]} the array of ranges
     * @param argument {RangeType[]}
     * @param copyFn {Function} function to copy values from other range
     * @param compareFn {Function} function to compare two ranges
     */
    static add(subject, argument, copyFn, compareFn) {
        var split = OrderedSegmentArray.splitRangeSetOverlapping(subject, argument[0].start, argument[argument.length - 1].end);
        var diff = DiffRangeSet.add(split.overlap, argument, null, null, null, null, copyFn, compareFn);
        return DiffRangeSetOperation._result(diff, split);
    }

    /**
     * Subtracts argument from subject
     * @param subject {RangeType[]} the array of ranges
     * @param argument {RangeType[]}
     * @param copyFn {Function} function to copy values from other range
     */
    static subtract(subject, argument, copyFn) {
        var split = OrderedSegmentArray.splitRangeSetOverlapping(subject, argument[0].start, argument[argument.length - 1].end);
        var diff = DiffRangeSet.subtract(split.overlap, argument, null, null, null, null, copyFn);
        DiffRangeSetOperation._result(diff, split);
    }

    /**
     * Subtracts diff.removed, then adds diff.added
     * @param subject
     * @param diff {{added, removed}}
     * @param copyFn
     * @param compareFn
     */
    static patch(subject, diff, copyFn, compareFn) {
        /*
         z added i removed trzeba zrobić rozłączne zbiory, żeby result diffy nie kolidowały ze sobą
         z removed usuń to co jest added
         */
        var toRemove = DiffRangeSet.subtract(diff.removed, diff.added, null, null, null, null, compareFn);

    }

    static _result(diff, split) {
        return {
            added: diff.added,
            removed: diff.removed,
            resized: diff.resized,
            result: [].concat(split.before, diff.result, split.after)
        };
    }
}
module.exports = DiffRangeSetOperation;
