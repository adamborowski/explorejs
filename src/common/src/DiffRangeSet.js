var qintervals = require('qintervals');
module.exports = class DiffRangeSet {

    /**
     * @method merge two sets by first trying to resize existing ranges and then append remeaining ranges
     * @param leftSet {{start:number, end:number}[]}
     * @param rightSet {{start:number, end:number}[]}
     */
    static add(leftSet, rightSet, iLeft, iRight) {
        var added = [];
        var removed = [];
        var resized = [];
        iLeft == iLeft || 0;
        iRight == iRight || 0;

        var left, right;
        var nextStep;
        var resizedElement;
        while (nextStep = this._computeNextStep(leftSet, rightSet, a, b)) {
            left = nextStep.left;
            right = nextStep.right;
            iLeft = nextStep.iLeft;
            iRight = nextStep.iRifht;
        }

        /*
         * rozpatruj każdą parę z A i B i próbuj poprowadzić strzałki
         */


        return this._result(result, [], [], [])
    }

    static _computeNextStep(leftSet, rightSet, iLeft, iRight) {
        var left = leftSet[iLeft];
        var right = rightSet[iRight];
        var nextLeft = leftSet[iLeft + 1];
        var nextRight = rightSet[iRight + 1];

        console.log(nextLeft, nextRight);
        if (nextLeft == null && nextRight == null) {
            // no next elements, finish
            return null;
        }
        if (nextRight == null) {
            // we can move only to left element
            return {left: nextLeft, right: null, iLeft: iLeft + 1, iRight: null, kind: 'left'};
        }
        if (nextLeft == null) {
            // we can move only to right element
            return {left: null, right: nextRight, iLeft: null, iRifht: iRight + 1, kind: 'right'};
        }
        if (nextLeft.start < nextRight.start) {
            // move to left element which is closer
            return {left: nextLeft, right, iLeft: iLeft + 1, iRight, kind: 'left'};
        }
        else {
            // move to right element which is closer
            return {left, right: nextRight, iLeft, iRight: iRight + 1, kind: 'right'};
        }
    }

    static _computeUnionRelation(cmp, subject) {
        if (subject.start > cmp.end) {
            return {isAfter: true};
        }
        if (subject.end < cmp.start) {
            return {isBefore: true};
        }
        // left and right overlap
        if (subject.start >= cmp.start && subject.end <= cmp.end) {
            return {isIncluded: true}; // or are equal
        }
        var ret = {isResizing: true, start: Math.min(subject.start, cmp.start), end: Math.max(subject.end, cmp.end)};
        if (subject.start < cmp.start) {
            ret.isStartChanged = true;
        }
        if (subject.end > cmp.end) {
            ret.isEndChanged = true;
        }
        return ret;
    }

    /**
     * @method
     * @param rangeSet {data}
     */
    static subtract(rangeSet) {
        var result = qintervals.subtract(a, b);
    }

    static _result(result, added, removed, resized) {
        return {
            result: result,
            added: added,
            removed: removed,
            resized: resized
        }
    }

};