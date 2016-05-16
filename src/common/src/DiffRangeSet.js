var qintervals = require('qintervals');
module.exports = class DiffRangeSet {

    /**
     * @method merge two sets by first trying to resize existing ranges and then append remeaining ranges
     * @param leftSet {{start:number, end:number}[]}
     * @param rightSet {{start:number, end:number}[]}
     */
    static add(leftSet, rightSet, iLeft, iRight) {
        var result = [], added = [], removed = [], resized = [];
        iLeft = iLeft || -1;
        iRight = iRight || -1;

        var left, right;
        var nextStep;
        var resizedItem = null, relation = {isAfter: true}, previousRelation;
        while ((nextStep = this._computeNextStep(leftSet, rightSet, iLeft, iRight)) != null) {
            left = nextStep.left;
            right = nextStep.right;
            iLeft = nextStep.iLeft;
            iRight = nextStep.iRight;
            previousRelation = relation;
            relation = this._computeUnionRelation(resizedItem || left, right);
            console.log(left, right, resizedItem, relation);
            if (relation.isIncluded) {
                // do nothing, no effect
            }
            else if (relation.isBefore && previousRelation.isAfter) {
                // right was not included in the previous union and is not to be included into upcoming union
                added.push(right);
            }
            else if (relation.isResizing) {
                if (resizedItem == null) {
                    resizedItem = {range: left, start: left.start, end: left.end};
                    resized.push(left);
                }
                Object.assign(resizedItem, relation);
            }
        }
        if (relation.isAfter) {
            // if the end, last element if was after, should be included also (there is no overlapping element in leftSet)
            added.push(right);
        }

        /*
         * rozpatruj każdą parę z A i B i próbuj poprowadzić strzałki
         */


        return this._result(result, added, removed, resized);
    }

    /**
     * returns new pair to compare in comparable range set.
     * Pairs are created subsequently by order of presence in each set
     * @param leftSet
     * @param rightSet
     * @param iLeft
     * @param iRight
     * @returns {*}
     * @private
     */
    static _computeNextStep(leftSet, rightSet, iLeft, iRight) {
        var left = leftSet[iLeft];
        var right = rightSet[iRight];
        var nextLeft = leftSet[iLeft + 1];
        var nextRight = rightSet[iRight + 1];

        if (iLeft == -1 && iRight == -1) {
            return {left: nextLeft, right: nextRight, iLeft: 0, iRight: 0, kind: 'initial'};
        }

        if (nextLeft == null && nextRight == null) {
            // no next elements, finish
            return null;
        }
        if (nextRight == null) {
            // we can move only to left element
            return {left: nextLeft, right, iLeft: iLeft + 1, iRight, kind: 'left'};
        }
        if (nextLeft == null) {
            // we can move only to right element
            return {left, right: nextRight, iLeft, iRight: iRight + 1, kind: 'right'};
        }
        if (nextLeft.start == nextRight.start) {
            if (left.end <= right.end) {
                return {left: nextLeft, right, iLeft: iLeft + 1, iRight, kind: 'left'};
            } else {
                return {left, right: nextRight, iLeft, iRight: iRight + 1, kind: 'right'};
            }
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
        if (subject == null) {
            return {};
        }
        if (cmp == null) {
            return {};
        }
        if (subject.start > cmp.end) {
            return {isAfter: true};
        }
        if (subject.end < cmp.start) {
            return {isBefore: true};
        }
        // left and right overlap
        if (subject.start == cmp.start && subject.end == cmp.end) {
            return {isEqual: true};
        }
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