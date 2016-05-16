var qintervals = require('qintervals');
module.exports = class DiffRangeSet {

    static pretty(obj) {
        var fields = [];
        for (var i in obj) {
            var val = obj[i];
            if (typeof val == 'boolean') {
                fields.push(i ? i : '! ' + i);
            }
            else if (typeof val == 'object') {
                fields.push(`${i} = ${this.pretty(val)}`)
            }
            else {
                fields.push(`${i} = ${val}`)
            }
        }
        return `{ ${fields.join(', ')} }`;

    }

    static _createGroup(range, fromLeft) {
        var group = {start: range.start, end: range.end};
        if (fromLeft) {
            group.range = range;
        }
        else {
            group.isStartChanged = true;
            group.isEndChanged = true;
        }
        return group;
    }
    /**
     * @method merge two sets by first trying to resize existing ranges and then append remeaining ranges
     * @param leftSet {{start:number, end:number}[]}
     * @param rightSet {{start:number, end:number}[]}
     */
    static add(leftSet, rightSet, iLeft, iRight) {
        var result = [], added = [], removed = [], resized = [];
        iLeft = iLeft || -1;
        iRight = iRight || -1;

        var step;
        var newIsRight, newIsLeft;
        var currentGroup = null, relation = {isAfter: true}, newItem;
        while ((step = this._computeNextStep(leftSet, rightSet, iLeft, iRight)) != null) {
            newIsRight = step.kind == 'right';
            newIsLeft = !newIsRight;
            iLeft = step.iLeft;
            iRight = step.iRight;
            newItem = newIsRight ? step.right : step.left;
            if (currentGroup == null) {
                // this is only for first group
                currentGroup = this._createGroup(newItem, newIsLeft);
                result.push(currentGroup);
            }
            relation = this._computeUnionRelation(currentGroup, newItem);
            console.log(`========
                left: ${this.pretty(step.left)}
               right: ${this.pretty(step.right)}
            movement: ${step.kind}
               group: ${this.pretty(currentGroup)}
            relation: ${this.pretty(relation)}`);

            if (relation.isIncluded || relation.isResizing) {
                if (newIsLeft) {
                    // existing item
                    if (currentGroup.range == null) {
                        currentGroup.range = newItem;
                    }
                    else {
                        removed.push(newItem);
                    }
                }
                else {
                    // do nothing, no effect
                }
            }
            if (relation.isResizing) {
                // new item will alter current group
                if (relation.isStartChanged) {
                    currentGroup.isStartChanged = true;
                    currentGroup.start = relation.start;
                }
                if (relation.isEndChanged) {
                    currentGroup.isEndChanged = true;
                    currentGroup.end = relation.end;
                }
            }
            else if (relation.isAfter) {
                // first, delete current group
                this._closeGroup(currentGroup, added, resized);
                currentGroup = this._createGroup(newItem, newIsLeft);
                result.push(currentGroup);
            }

        }

        // after all iterations, we have still one group open
        if (currentGroup) {
            // there is no group if we add empty set to empty set
            this._closeGroup(currentGroup, added, resized);
        }

        return this._result(result, added, removed, resized);
    }

    static _closeGroup(currentGroup, added, resized) {
        if (currentGroup.range == null) {
            // there were no existing ranges to resize
            var addedItem = {start: currentGroup.start, end: currentGroup.end};
            added.push(addedItem);
        }
        else if (currentGroup.isStartChanged || currentGroup.isEndChanged) {
            // there is a existing group which can be resized
            resized.push(currentGroup);
        }
        // else: group with range but without start or end changed, this is single existing range, do nothing
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
            return null;
        }

        if (leftPoint <= rightPoint) {
            return {left: nextLeft, right, iLeft: iLeft + 1, iRight, kind: 'left'};
        } else {
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