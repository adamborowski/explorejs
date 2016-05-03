/**
 * @property {Number} left
 * @property {Number} right
 * @property {Number} leftClosed
 * @property {Number} rightClosed
 */
module.exports = class Range {
    constructor(left, right, leftClosed, rightClosed) {
        this.left = left;
        this.right = right;
        this.leftClosed = leftClosed;
        this.rightClosed = rightClosed;
    }

    static opened(left, right) {
        return new Range(left, right, false, false);
    }

    static closed(left, right) {
        return new Range(left, right, true, true);
    }

    static leftClosed(left, right) {
        return new Range(left, right, true, false);
    }

    static rightClosed(left, right) {
        return new Range(left, right, false, true);
    }

    leftTouches(v) {
        return this.leftClosed && this.left == v;
    }

    rightTouches(v) {
        return this.rightClosed && this.right == v;
    }

    containsPoint(v) {
    }

    /**
     * other right must be not before this left
     * and other left must be not after this right
     * @param other {Range}
     */
    hasCommon(other) {
        var b = other.right > this.left && other.left < this.right;
        if (b) {
            return true;
        }
        return this.leftClosed && other.leftClosed && this.left == other.left
            || this.rightClosed && other.rightClosed && this.right == other.right
            || this.rightClosed && other.leftClosed && this.right == other.left
            || this.leftClosed && other.rightClosed && this.left == other.right;
    }


};