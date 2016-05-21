var _ = require('underscore');
var defaultOptions = {
    startLeft: 0, startRight: 0, endLeft: null, endRight: null,
    pairMode: false // assure pairs are changing (starting with both left and right set + edge cases)
};
/**
 * Iterator for two ordered sets. Each iteration it chooses the next closest range from left or right set.
 * It supports adding extra range during iterating.
 * It executes in place with memory complexity O(1)
 * It is needed to perform addition and substraction operations for two oreded range sets.
 * TOTO add special mode 'pairMode' to iterate over pairs not over next closed range from any set
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
        this._moveLeftRequested = false;
        this._moveRightRequested = false;
        this._suspendLeftRequested = false;
        this._suspendRightRequested = false;
        this.counter = -1;
        this.leftCounter = -1;
        this.rightCounter = -1;
    }

    /**
     * @return {Boolean} true if next pair is available
     */
    next() {
        this.counter++;
        var moveLeftRequested = this._moveLeftRequested;
        var moveRightRequested = this._moveRightRequested;
        var suspendLeftRequested = this._suspendLeftRequested;
        var suspendRightRequested = this._suspendRightRequested;
        this._moveLeftRequested = false;
        this._moveRightRequested = false;
        this._suspendLeftRequested = false;
        this._suspendRightRequested = false;
        var left = this._left;
        var right = this._right;
        var nextLeft = this._peekNextLeft();
        var nextRight = this._peekNextRight();

        if (this._options.pairMode && this.counter == 0) {
            var moved = false;
            if (left == null && this.CanMoveLeft && !suspendLeftRequested) {
                this._moveLeft();
                moved = true;
            }
            if (right == null && this.CanMoveRight && !suspendRightRequested) {
                this._moveRight();
                moved = true;
            }
            return moved;
        }


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
            if (moveRightRequested) {
                this._tryMoveRight(); // do this before actual move to not override move flag
            }
            if (!suspendLeftRequested) {
                this._moveLeft();
            }
            return true;
        } else {
            if (this._options.endRight === this._iRight) {
                return false;
            }
            if (moveLeftRequested) {
                this._tryMoveLeft(); // do this before actual move to not override move flag
            }
            if (!suspendRightRequested) {
                this._moveRight();
            }
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

    get LeftIsFromBuffer() {
        return this._leftIsFromBuffer;
    }

    requestMoveLeft() {
        this._moveLeftRequested = true;
    }

    requestMoveRight() {
        this._moveRightRequested = true;
    }

    requestSuspendLeft() {
        this._suspendLeftRequested = true;
    }

    requestSuspendRight() {
        this._suspendRightRequested = true;
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

    get CanMoveLeft() {
        return this._peekNextLeft() != null;
    }

    get CanMoveRight() {
        return this._peekNextRight() != null;
    }

    /**
     * @private
     */
    _moveLeft() {
        this.leftCounter++;
        if (this._leftBuffer.length) {
            this._left = this._leftBuffer.shift();
            this._leftIsFromBuffer = true;
        }
        else {
            this._iLeft++;
            this._left = this._leftSet[this._iLeft];
            this._leftIsFromBuffer = false;
        }
        this._leftMoved = true;
    }

    /**
     * @private
     */
    _moveRight() {
        this.rightCounter++;
        this._iRight++;
        this._leftMoved = false;
        this._right = this._rightSet[this._iRight];
    }

    _tryMoveLeft() {
        if (this._iLeft < this._leftSet.length && (this._options.endLeft == null || this._iLeft < this._options.endLeft)) {
            this._moveLeft();
        }
    }

    _tryMoveRight() {
        if (this._iRight < this._rightSet.length - 1 && (this._options.endRight == null || this._iRight < this._options.endRight)) {
            this._moveRight();
        }
    }
}
module.exports = ParallelRangeSetIterator;