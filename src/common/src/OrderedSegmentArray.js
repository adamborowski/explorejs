var bs = require('binarysearch');
var _ = require('underscore');
var options = {
    leftBoundKey: 'left',
    rightBoundKey: 'right',
    leftBoundClosed: true,
    rightBoundClosed: false
};
/**
 * Provides effective sorted array manipulation.
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
    }

    /**
     * Inserts range of segments into array assuming the there are no existing ranges between first and last range
     * @param range must be ordered and not overlap with existing segment
     */
    insertRange(range) {

    }

    /**
     * Merges range of segments into array with preserving order of overlapped segments in array
     * @param range array of segments, can overlap existing segments
     */
    mergeRange(range) {

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
    getRange(rangeLeftBound, rangeRightBound) {
        if (arguments.length == 0) {
            return this._data;
        }

        var firstSegmentIndex = this._findRightBoundIndex(rangeLeftBound);
        var lastSegmentIndex = this._findLeftBoundIndex(rangeRightBound);
        var data = this._data;

        // exclude possibly disjunctive outer segments

        var firstSegmentRight_vs_rangeLeft = this._rightBoundComparator(data[firstSegmentIndex], rangeLeftBound);
        if (firstSegmentRight_vs_rangeLeft < 0) {
            firstSegmentIndex++;
        }
        var lastSegmentLeft_vs_rangeRight = this._leftBoundComparator(data[lastSegmentIndex], rangeRightBound);
        if (lastSegmentLeft_vs_rangeRight > 0) {
            lastSegmentIndex--;
        }

        // exclude touching segments for open bounds

        if (firstSegmentRight_vs_rangeLeft == 0 && this.options.leftBoundClosed == false) {
            firstSegmentIndex++;
        }
        if (lastSegmentLeft_vs_rangeRight == 0 && this.options.rightBoundClosed == false) {
            lastSegmentIndex--;
        }


        return data.slice(firstSegmentIndex, lastSegmentIndex + 1);
    }

    _findLeftBoundIndex(boundValue) {
        return bs.closest(this._data, boundValue, this._leftBoundComparator)
    }

    _findRightBoundIndex(boundValue) {
        return bs.closest(this._data, boundValue, this._rightBoundComparator)
    }
}
module.exports = OrderedSegmentArray;