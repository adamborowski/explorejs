var bs = require('binarysearch');
var _ = require('underscore');
var Range = require('./Range');
var options = {
    leftBoundKey: 'left',
    rightBoundKey: 'right',
    leftBoundClosed: true,
    rightBoundClosed: false
};
/**
 * Implementation of segment array where each segment doesn't overlap each other.
 * All segments all disjoint or touch others
 */
class OrderedSegmentArray {

    /**
     * @param [options.leftBoundKey]
     * @param [options.rightBoundKey]
     * @param [options.leftBoundClosed]
     * @param [options.rightBoundClosed]
     */
    constructor(options) {
        this.options = _.defaults(options, OrderedSegmentArray);
        this._leftBoundComparator = new Function('e', 'find',
            `return e['${this.options.leftBoundKey}'] - find;`
        );
        this._rightBoundComparator = new Function('e', 'find',
            `return e['${this.options.rightBoundKey}'] - find;`
        );
        this._data = [];
        this._log = _.noop;
    }

    /**
     * Inserts range of segments into array assuming the there are no existing ranges between first and last range
     * @param range must be ordered and not overlap with existing segment
     */
    insertRange(range) {
        var leftBoundKey = this.options.leftBoundKey;
        var rightBoundKey = this.options.rightBoundKey;
        var rangeLeft = range[0][leftBoundKey];
        var rangeRight = range[range.length - 1][rightBoundKey];
        var leftNeighborIndex = OrderedSegmentArray._findBoundNotAfter(this._data, rangeLeft, this._rightBoundComparator);
        var rightNeighborIndex = OrderedSegmentArray._findBoundNotBefore(this._data, rangeRight, this._leftBoundComparator);
        var numberSegmentsInside = rightNeighborIndex - leftNeighborIndex - 1;

        if (numberSegmentsInside == 0) {
            //segments are not overlapping
            this._data.splice(leftNeighborIndex + 1, 0, ...range);
        } else {
            throw new Error("You can insert only into a gap. There are items in your range, so you should use mergeRange method");
        }


    }

    /**
     * Merges range of segments into array with preserving order of overlapped segments in array
     * @param range array of segments, can overlap existing segments
     */
    mergeRange(range) {
        if (range.length == 0) {
            return;
        }
        if (this._data.length == 0) {
            this._data = range;
            return;
        }
        var leftBoundKey = this.options.leftBoundKey;
        var rightBoundKey = this.options.rightBoundKey;
        var rangeLeft = range[0][leftBoundKey];
        var rangeRight = range[range.length - 1][rightBoundKey];
        var leftNeighborIndex = OrderedSegmentArray._findBoundBefore(this._data, rangeLeft, this._rightBoundComparator);
        var rightNeighborIndex = OrderedSegmentArray._findBoundAfter(this._data, rangeRight, this._leftBoundComparator);

        var numberSegmentsInside = rightNeighborIndex - leftNeighborIndex - 1;
        var overlappedSegments = this._data.slice(leftNeighborIndex + 1, rightNeighborIndex);
        this._log('data', this._data);
        this._log('range', range);
        this._log('overlapping segments', overlappedSegments);
        this._log('merging inside', numberSegmentsInside, overlappedSegments);

        if (numberSegmentsInside == 0) {
            //segments are not overlapping
            this._data.splice(leftNeighborIndex + 1, 0, ...range);
        }
        else if (numberSegmentsInside < 0 && range.length > 1) {
            throw new Error('This should not happened');
        }
        else {
            // we have to merge
            // todo prevent unnecessary slice range1
            var merged = this._mergeRanges(overlappedSegments, range);
            this._data.splice(leftNeighborIndex + 1, numberSegmentsInside, ...merged);//todo unuse splice to avoid browser limit errors with too many arguments ...merged
        }


    };

    /**
     * Performs merging two sorted array of segments
     * Note that mergin concerns only left bounds, assuming all segments are not overlapping
     * If second range has segment overwriting any segment in first range,
     * segment from first range will be excluded.
     * @param range1 first range
     * @param range2 seconds range
     * @returns {Array}
     * @private
     */
    _mergeRanges(range1, range2) {
        var leftBoundKey = this.options.leftBoundKey;
        var result = [];
        var i1 = 0, i2 = 0;
        while (i1 < range1.length || i2 < range2.length) {
            if (i1 == range1.length) {
                result.push(range2[i2++]);
            }
            else if (i2 == range2.length) {
                result.push(range1[i1++]);
            }
            else if (range1[i1][leftBoundKey] == range2[i2][leftBoundKey]) {
                result.push(range2[i2++]);
                i1++;
            }
            else if (range1[i1][leftBoundKey] < range2[i2][leftBoundKey]) {
                result.push(range1[i1++]);
            }
            else {
                result.push(range2[i2++]);
            }
        }
        return result;
    }


    /**
     * @param openKey first segment open key
     * @param closeKey last segment close key
     */
    removeRange(openKey, closeKey) {

    }

    /**
     *
     * @param openIndex first segment index
     * @param closeIndex last segment index
     */
    removeRangeByIndex(openIndex, closeIndex) {

    }

    /**
     * Returns range of segments which contains specified range
     * @param rangeLeftBound left bound to find first segment
     * @param rangeRightBound right bound to find last segment
     * @returns {Array}
     */
    getRange(rangeLeftBound, rangeRightBound, options) {
        if (arguments.length == 0) {
            return this._data;
        }
        var indexes = this.findRangeIndexes(rangeLeftBound, rangeRightBound, options);
        if (options.oneMore) {
            indexes.right++;
        }
        return this._data.slice(indexes.left, indexes.right + 1);
    }

    /**
     *
     * @param {Range} range
     */
    getRange2(range, oneMore = false) {
        var left = range.left;
        var right = range.right;
        var options = {
            leftBoundClosed: range.leftClosed,
            rightBoundClosed: range.rightClosed,
            oneMore: oneMore
        };
        return this.getRange(left, right, options);
    }

    /**
     *
     * @param rangeLeftBound
     * @param rangeRightBound
     * @param [options]
     * @returns {{left: *, right: *}}
     */
    findRangeIndexes(rangeLeftBound, rangeRightBound, options) {
        if (this._data.length == 0) {
            return {left: -1, right: -1};
        }
        options = _.defaults(options || {}, {
            leftBoundClosed: this.options.leftBoundClosed,
            rightBoundClosed: this.options.rightBoundClosed
        });
        var firstSegmentIndex = OrderedSegmentArray._findBoundNotBefore(this._data, rangeLeftBound, this._rightBoundComparator);
        var lastSegmentIndex = OrderedSegmentArray._findBoundNotAfter(this._data, rangeRightBound, this._leftBoundComparator);

        // exclude touching segments for open bounds

        if (firstSegmentIndex >= this._data.length || lastSegmentIndex < 0) {
            return {left:-1, right:-1};
        }

        var firstSegmentRight_vs_rangeLeft = this._rightBoundComparator(this._data[firstSegmentIndex], rangeLeftBound);
        var lastSegmentLeft_vs_rangeRight = this._leftBoundComparator(this._data[lastSegmentIndex], rangeRightBound);
        if (firstSegmentRight_vs_rangeLeft == 0 && options.leftBoundClosed == false) {
            firstSegmentIndex++;
        }
        if (lastSegmentLeft_vs_rangeRight == 0 && options.rightBoundClosed == false) {
            lastSegmentIndex--;
        }

        return {left: firstSegmentIndex, right: lastSegmentIndex};
    }

    static _findBoundNotAfter(data, boundValue, boundComparator) {
        if (data.length == 0) {
            return 0;
        }
        var index = bs.closest(data, boundValue, boundComparator);
        if (boundComparator(data[index], boundValue) > 0) {
            // found bound is greater
            return index - 1;
        }
        return index;
    }
    static _findBoundBefore(data, boundValue, boundComparator) {
        if (data.length == 0) {
            return 0;
        }
        var index = bs.closest(data, boundValue, boundComparator);
        if (boundComparator(data[index], boundValue) >= 0) {
            // found bound is greater
            return index - 1;
        }
        return index;
    }

    static _findBoundNotBefore(data, boundValue, boundComparator) {
        if (data.length == 0) {
            return 0;
        }
        var index = bs.closest(data, boundValue, boundComparator);
        if (boundComparator(data[index], boundValue) < 0) {
            // found bound is lower
            return index + 1;
        }
        return index;
    }
    static _findBoundAfter(data, boundValue, boundComparator) {
        if (data.length == 0) {
            return 0;
        }
        var index = bs.closest(data, boundValue, boundComparator);
        if (boundComparator(data[index], boundValue) <= 0) {
            // found bound is lower
            return index + 1;
        }
        return index;
    }

    static splitRangeSetOverlapping(rangeSet, start, end, {leftClosed = true, rightClosed = true}={}) {
        var indices = this.getOverlapBoundIndices(rangeSet, start, end, {leftClosed, rightClosed});
        var before = rangeSet.slice(0, indices.start);
        var overlap = rangeSet.slice(indices.start, indices.end);
        var after = rangeSet.slice(indices.end);
        return {before, overlap, after, start: indices.start, end: indices.end};
    }

    //TODO should be moved somewhere else
    static cutRangeSet(rangeSet, start, end, copyFn) {
        var split = this.splitRangeSetOverlapping(rangeSet, start, end, {leftClosed: false, rightClosed: false});

        const leftBound = split.overlap[0];
        if (leftBound && leftBound.start < start) {
            var leftBoundLeftClone = copyFn ? copyFn(leftBound) : {};
            leftBoundLeftClone.start = leftBound.start;
            leftBoundLeftClone.end = start;
            var leftBoundRightClone = copyFn ? copyFn(leftBound) : {};
            leftBoundRightClone.start = start;
            leftBoundRightClone.end = leftBound.end;
            split.before.push(leftBoundLeftClone);
            split.overlap[0] = leftBoundRightClone;
        }

        const rightBound = split.overlap[split.overlap.length - 1];
        if (rightBound && rightBound.end > end) {
            var rightBoundLeftClone = copyFn ? copyFn(rightBound) : {};
            rightBoundLeftClone.start = rightBound.start;
            rightBoundLeftClone.end = end;
            var rightBoundRightClone = copyFn ? copyFn(rightBound) : {};
            rightBoundRightClone.start = end;
            rightBoundRightClone.end = rightBound.end;
            split.after.push(rightBoundRightClone);
            split.overlap[split.overlap.length - 1] = rightBoundLeftClone;
        }
        return split;
    }

    /**
     * Join two array of touching ranges but merge toucing ranges if are compared
     * @param leftRange
     * @param rightRange
     * @param copyFn
     * @param cmpFn
     * @return {Array.<*>}
     */
    static joinTouchingRangeArrays(leftRange, rightRange, copyFn = (a)=>({levelId: a.levelId}), cmpFn = (a, b)=>a.levelId == b.levelId) {
        if (leftRange.length == 0) {
            return [].concat(rightRange);
        }
        if (rightRange.length == 0) {
            return [].concat(leftRange);
        }
        // now we have both ranges with at least one element
        const leftBoundRange = leftRange[leftRange.length - 1];
        const rightBoundRange = rightRange[0];
        if (cmpFn(leftBoundRange, rightBoundRange)) {
            // we have to join ranges if touches, throw error if overlaps
            if (leftBoundRange.end > rightBoundRange.start) {
                throw new Error('cannot join range arrays: boundary ranges overlap');
            }
            if (leftBoundRange.end == rightBoundRange.start) {
                var extended = copyFn(leftBoundRange);
                extended.start = leftBoundRange.start;
                extended.end = rightBoundRange.end;
                return leftRange.slice(0, -1).concat([extended], rightRange.slice(1));
            }
        }
        return [].concat(leftRange, rightRange);
    }

    /**
     * Return the indices of bound ranges in a range specified by {@param start} and {@param end} parameters
     * @param rangeSet {{start:number, end:number}[]}
     * @param start the range start parameter
     * @param end the range end parameter
     * @return {{start: number, end: number}}
     * start: an index where overlap begins
     * end: an index of first range not overlapping given range, after {@code start} range
     * if start == end, then no ranges overlapping, although you can insert given range at start position
     */
    static getOverlapBoundIndices(rangeSet, start, end, {leftClosed = true, rightClosed = true}={}) {
        if (rangeSet.length == 0) {
            return {
                start: 0,
                end: 0
            }
        }

        var range = new Range(start, end, leftClosed, rightClosed);

        var leftIndex = bs.closest(rangeSet, start, this._rangeEndComparator);
        var rightIndex = bs.closest(rangeSet, end, this._rangeStartComparator);
        const leftRange = rangeSet[leftIndex];
        const rightRange = rangeSet[rightIndex];


        if (leftRange != null && Range.closed(leftRange.start, leftRange.end).isBefore(range)) {
            leftIndex++;
        }
        if (rightRange != null && !Range.closed(rightRange.start, rightRange.end).isAfter(range)) {
            rightIndex++;
        }
        return {
            start: leftIndex,
            end: rightIndex
        }
    }

    static _rangeStartComparator(range, start) {
        return range.start - start;
    }

    static _rangeEndComparator(range, end) {
        return range.end - end;
    }

}
module.exports = OrderedSegmentArray;