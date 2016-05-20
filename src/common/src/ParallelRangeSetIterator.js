var _ = require('underscore');
var defaultOptions = {
    startLeft: 0, startRight: 0, endLeft: null, endRight: null
};
/**
 * Iterator for comparing two ordered sets pair by pair.
 * It supports adding extra range during iterating.
 * It executes in place with memory complexity O(1)
 * It is needed to perform addition and substraction operations for two oreded range sets.
 * @type {ParallelRangeSetIterator}
 */
class ParallelRangeSetIterator {
    constructor(leftSet, rightSet, options) {
        this._options = options = _.defaults(options || {}, defaultOptions);
        this._leftSet = leftSet;
        this._rightSet = rightSet;
        this._iLeft = options.startLeft - 1;
        this._iRight = options.startRight - 1;
        this._leftBuffer = [];
        this._left = leftSet[this._iLeft] || null; // most cases: leftSet[-1] = null
        this._right = rightSet[this._iRight] || null;
    }

    /**
     * @return {Boolean} true if next pair is available
     */
    next() {
        var left = this._left;
        var right = this._right;
        var nextLeft = this._peekNextLeft();
        var nextRight = this._peekNextRight();


        var leftPoint = Infinity, rightPoint = Infinity;

        if (nextLeft) {
            leftPoint = nextLeft.start;
        }
        if (nextRight) {
            rightPoint = nextRight.start;
        }
        if (nextLeft && nextRight && leftPoint == rightPoint) {
            if (left || right) {
                if (left) {
                    leftPoint = left.end;
                }
                else {
                    leftPoint = -Infinity;
                }
                if (right) {
                    rightPoint = right.end;
                }
                else {
                    rightPoint = -Infinity;
                }
            }
        }

        if (!isFinite(rightPoint) && !isFinite(leftPoint)) {
            return false;
        }

        if (leftPoint <= rightPoint) {
            if (this._options.endLeft === this._iLeft) {
                return false;
            }
            this._moveLeft();
            return true;
        } else {
            if (this._options.endRight === this._iRight) {
                return false;
            }
            this._moveRight();
            return true;
        }
    }

    insertAsNextLeft(range) {
        var nextRegularLeft = this._leftSet[this._iLeft + 1];
        var insertionPoint = this._leftBuffer.length == 0 ? this._left : this._leftBuffer[this._leftBuffer.length];
        if ((insertionPoint == null || insertionPoint.start <= range.start) && (nextRegularLeft == null || nextRegularLeft.end >= range.end)) {
            this._leftBuffer.push(range);
        }
        else {
            throw new Error(`Cannot insert the range at the current position. It will break the order instead. 
            Current is ${JSON.stringify(this._left)}, 
            Next is ${JSON.stringify(this._peekNextLeft())}, 
            New is ${JSON.stringify(range)}`);
        }
    }

    get Left() {
        return this._left;
    }

    get Right() {
        return this._right;
    }

    get LeftMoved() {
        return this._leftMoved;
    }

    get RightMoved() {
        return !this._leftMoved;
    }

    get Current() {
        return this._leftMoved ? this._left : this._right;
    }

    /**
     * @private
     */
    _peekNextLeft() {
        if (this._leftBuffer.length) {
            return this._leftBuffer[0];
        }
        return this._leftSet[this._iLeft + 1];
    }

    /**
     * @private
     */
    _peekNextRight() {
        return this._rightSet[this._iRight + 1];
    }

    /**
     * @private
     */
    _moveLeft() {
        if (this._leftBuffer.length) {
            this._left = this._leftBuffer.shift();
        }
        else {
            this._iLeft++;
            this._left = this._leftSet[this._iLeft];
        }
        this._leftMoved = true;
    }

    /**
     * @private
     */
    _moveRight() {
        this._iRight++;
        this._leftMoved = false;
        this._right = this._rightSet[this._iRight];
    }
}
module.exports = ParallelRangeSetIterator;