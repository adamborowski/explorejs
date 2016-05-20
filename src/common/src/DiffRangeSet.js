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

    static _createGroup(range, fromExistingRange) {
        var group = {start: range.start, end: range.end};
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
    static add(leftSet, rightSet, iLeft, iRight, maxILeft, maxIRight) {
        var result = [], added = [], removed = [], resized = [];

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
                currentGroup = this._createGroup(iterator.Current, iterator.LeftMoved);
            }
            relation = this._computeOverlapRelation(currentGroup, iterator.Current);
            console.log(`========
                left: ${this.pretty(iterator.left)}
               right: ${this.pretty(iterator.right)}
            movement: ${iterator.LeftMoved ? 'left' : 'right'}
               group: ${this.pretty(currentGroup)}
            relation: ${this.pretty(relation)}`);

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
                currentGroup = this._createGroup(iterator.Current, iterator.LeftMoved);
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
            var addedItem = {start: currentGroup.start, end: currentGroup.end};
            added.push(addedItem);

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
    static subtract(leftSet, rightSet, iLeft, iRight, maxILeft, maxIRight) {
        var result = [], added = [], removed = [], resized = [];

        var leftSubject = null, relation;
        var iteration = new ParallelRangeSetIterator(leftSet, rightSet, {
            startLeft: iLeft,
            startRight: iRight,
            endLeft: maxILeft,
            endRight: maxIRight
        });
        iteration.next(); // we omit the first pair (null, X) or (X, null)
        while (iteration.next()) {
            leftSubject = this._createGroup(iteration.Left, !iteration.LeftIsFromBuffer/* indicate if this group is existing one */);
            relation = CutOperation.getCutInfo(leftSubject, iteration.Right);
            console.log(`========
                left: ${this.pretty(iteration.Left)}
               right: ${this.pretty(iteration.Right)}
            movement: ${iteration.LeftMoved ? 'left' : 'right'}
         leftSubject: ${this.pretty(leftSubject)}
            relation: ${relation}`);
            if (relation == 'below') {
                // we should close previous group
                this._finishGroup(leftSubject, added, resized, result);
                leftSubject = null;
            }
            else if (relation == "remove") {
                // right will completely remove current subject
                if (leftSubject.existing) {
                    removed.push(leftSubject.existing);
                }
                else {
                    // ignore - this groups was created temporarily as a consequence of earlier iteration
                }
                leftSubject = null;
            }
            else if (relation == 'middle') {// todo tam gdzie powstają nowe zbiory - trzeba dodać iteracje, bo
                // right will split subject into two subjects
                var newStart = iteration.Right.end;
                var newEnd = leftSubject.end;
                leftSubject.end = iteration.Right.start;
                this._finishGroup(leftSubject, added, resized, result);
                iteration.insertAsNextLeft({
                    start: newStart,
                    end: newEnd
                });
                leftSubject = null;

            }
            else if (relation == 'top') {
                leftSubject.start = iteration.Right.end;
            }
            else if (relation == 'bottom') {
                leftSubject.end = iteration.Right.start;
                this._finishGroup(leftSubject, added, resized, result);
                leftSubject = null;
            }
        }

        // after all iterations, we have still one group open
        if (leftSubject) {
            // there is no group if we add empty set to empty set
            this._finishGroup(leftSubject, added, resized, result);
        }

        return this._result(result, added, removed, resized);
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