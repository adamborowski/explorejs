var CutOperation = require('./CutOperation');
var ParallelRangeSetIterator = require('./ParallelRangeSetIterator');
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

    static _createGroup(range, fromExistingRange, copyFn) {
        var group = copyFn(range);
        group.start = range.start;
        group.end = range.end;
        if (fromExistingRange) {
            group.existing = range;
        }
        return group;
    }

    /**
     * @method merge two sets by first trying to resize existing ranges and then append remeaining ranges
     * @param leftSet {{start:number, end:number}[]}
     * @param rightSet {{start:number, end:number}[]}
     * @param {Number} [iLeft]
     * @param {Number} [iRight]
     * @param {Number} [maxILeft]
     * @param {Number} [maxIRight]
     */
    static add(leftSet, rightSet, iLeft, iRight, maxILeft, maxIRight, copyFn) {
        var result = [], added = [], removed = [], resized = [];
        if (copyFn == null) {
            copyFn = (x)=>({});
        }

        var currentGroup = null, relation;
        var iterator = new ParallelRangeSetIterator(leftSet, rightSet, {
            startLeft: iLeft,
            startRight: iRight,
            endLeft: maxILeft,
            endRight: maxIRight
        });
        while (iterator.next()) {
            if (currentGroup == null) {
                // this is only for first group
                currentGroup = this._createGroup(iterator.Current, iterator.LeftMoved, copyFn);
            }
            relation = this._computeOverlapRelation(currentGroup, iterator.Current);
            // console.log(`========
            //     left: ${this.pretty(iterator.left)}
            //    right: ${this.pretty(iterator.right)}
            // movement: ${iterator.LeftMoved ? 'left' : 'right'}
            //    group: ${this.pretty(currentGroup)}
            // relation: ${this.pretty(relation)}`);

            if (relation.isIncluded || relation.isResizing || relation.isEqual) {
                if (iterator.LeftMoved) {
                    // existing item
                    if (currentGroup.existing == null) {
                        // we have a group containing only items from right set, now we join left item and assign ownership range
                        currentGroup.existing = iterator.Current;
                    }
                    else if (currentGroup.existing != iterator.Current) {
                        // we have group with ownership and new left item belongs to the group so it is no longer needed
                        removed.push(iterator.Current);
                    }
                }
                else {
                    // do nothing, no effect
                }
            }
            if (relation.isResizing) {
                // new item will alter current group
                if (relation.isStartChanged) {
                    currentGroup.start = relation.start;
                }
                if (relation.isEndChanged) {
                    currentGroup.end = relation.end;
                }
            }
            else if (relation.isAfter) {
                // first, delete current group
                this._finishGroup(currentGroup, added, resized, result);
                currentGroup = this._createGroup(iterator.Current, iterator.LeftMoved, copyFn);
            }

        }

        // after all iterations, we have still one group open
        if (currentGroup) {
            // there is no group if we add empty set to empty set
            this._finishGroup(currentGroup, added, resized, result);
        }

        return this._result(result, added, removed, resized);
    }

    static _finishGroup(currentGroup, added, resized, result) {
        if (currentGroup.existing == null) {
            // there were no existing ranges to resize
            added.push(currentGroup);

        }
        else if (this._isGroupChanged(currentGroup)) {
            // there is a existing group which can be resized
            resized.push(currentGroup);
        }
        if (result != null) {
            result.push(currentGroup);
        }
        // else: group with range but without start or end changed, this is single existing range, do nothing
    }

    static _isGroupChanged(group) {
        if (group.existing == null) {
            return false;
        }
        return group.start != group.existing.start || group.end != group.existing.end;
    }


    static _computeOverlapRelation(cmp, subject) {
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
     * @param leftSet
     * @param rightSet
     * @param [iLeft]
     * @param [iRight]
     * @param [maxILeft]
     * @param [maxIRight]
     */
    static subtract(leftSet, rightSet, iLeft, iRight, maxILeft, maxIRight, copyFn) {
        var result = [], added = [], removed = [], resized = [];

        if (copyFn == null) {
            copyFn = (x)=>({});
        }

        var relation;
        var iteration = new ParallelRangeSetIterator(leftSet, rightSet, {
            startLeft: iLeft,
            startRight: iRight,
            endLeft: maxILeft,
            endRight: maxIRight,
            pairMode: true
        });
        var leftSubject = null;

        var addResult = (group) => {
            result.push(group);
            if (group.existing == null) {
                added.push(group);
            }
            if (this._isGroupChanged(group)) {
                resized.push(group);
            }
            iteration.requestMoveLeft();
            leftSubject = null;
        };
        while (iteration.next()) {
            if (leftSubject == null && iteration.Left) {
                leftSubject = this._createGroup(iteration.Left, !iteration.LeftIsFromBuffer/* indicate if this group is existing one */, copyFn);
            }
            relation = CutOperation.getCutInfo(leftSubject, iteration.Right);

         //    console.log(`========
         //        left: ${this.pretty(iteration.Left)}
         // leftSubject: ${this.pretty(leftSubject)}
         //       right: ${this.pretty(iteration.Right)}
         //    movement: ${iteration.LeftMoved ? 'left' : 'right'}, from buffer: ${iteration.LeftIsFromBuffer}
         //    relation: ${relation}`);
            switch (relation) {
                case null:
                    if (leftSubject) {
                        result.push(leftSubject);
                    }
                    leftSubject = null;
                    break;
                case 'remove':
                    // right will completely remove current subject
                    if (leftSubject.existing) {
                        removed.push(leftSubject.existing);
                    }
                    else {
                        // ignore - this groups was created temporarily as a consequence of earlier iteration
                    }
                    iteration.requestMoveLeft();
                    leftSubject = null;
                    break;
                case 'middle':
                    // right will split subject into two subjects
                    var nextLeft = copyFn(leftSubject.existing);
                    var newStart = iteration.Right.end;
                    var newEnd = leftSubject.end;
                    leftSubject.end = iteration.Right.start;
                    addResult(leftSubject);

                    nextLeft.start = newStart;
                    nextLeft.end = newEnd;
                    iteration.insertAsNextLeft(nextLeft);
                    iteration.requestMoveRight(); // we are sure that this 'middle' element is not overlapping the future elements
                    break;
                case 'top':
                    // if we cut the top of left range, we should reduce the range and put it back into the queue, then force to use this range in next step
                    leftSubject.start = iteration.Right.end;// maybe will be put into resized in future iteration
                    iteration.requestSuspendLeft(); // for next step, do not override leftSubject in next iteration
                    iteration.requestMoveRight();
                    break;
                case 'bottom':
                    // warto wtedy wymusic moveLeft w następnej iteracij
                    // jeśli usuwamy dół obiektu, mamy prawo go zakonczyc
                    leftSubject.end = iteration.Right.start;
                    addResult(leftSubject);
                    break;
                case 'above':
                    var nextItem = iteration._peekNextRight();
                    var cutInfo = CutOperation.getCutInfo(leftSubject, nextItem);
                    if (cutInfo == 'below' || cutInfo == null) {
                        addResult(leftSubject);
                    }
                    break;
                case 'below':
                    // any right range below the left one will enter this execution path
                    addResult(leftSubject);
                    break;
            }
        }

        // after all iterations, we have still one group open
        if (leftSubject && {top: true, above: true, middle: true}[relation] == true) {
            // there is no group if we add empty set to empty set
            addResult(leftSubject);
        }

        return this._result(result, added, removed, resized);
    }

    static _rangeEquals(a, b) {
        if (a == b) {
            return true;
        }
        if (a == null || b == null) {
            return false;
        }
        if (a.existing != null || b.existing != null) {
            return this._rangeEquals(a.existing, b.existing);
        }
        if (a.start == b.start && a.end == b.end) {
            return true;
        }
        return false;
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