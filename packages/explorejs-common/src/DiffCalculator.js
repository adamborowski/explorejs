const FactoryDictionary = require('./FactoryDictionary');

class DiffCalculator {

    /**
     * Compute diff between left set and right set
     * A time complexity is O(6*numGroups*(leftSet.length+rightSet.length))
     * because it has to perform linear diff for each group then merge each sorted diff.added, diff.resized, diff.removed
     * @param leftSet
     * @param rightSet
     * @param leftStart initial index of left element
     * @param rightStart initial index of right element
     * @param leftEnd index of first left element not compared in diff
     * @param rightEnd index of first right element not compared in diff
     * @param groupFn
     * @param copyFn function returning object containg additional range attributes (levelId, data, etc)
     * @return {added: Object[], removed: Object[], resized: Object[]} of
     */
    static compute(leftSet, rightSet, {
        leftStart = 0, rightStart = 0, leftEnd = leftSet.length, rightEnd = rightSet.length,
        groupFn = r => r.levelId, copyFn = r => ({levelId: r.levelId})
    } = {}) {

        const groups = new FactoryDictionary(g => ({leftSet: [], rightSet: [], group: g}));

        leftSet.slice(leftStart, leftEnd).forEach(r => groups.get(groupFn(r)).leftSet.push(r));
        rightSet.slice(rightStart, rightEnd).forEach(r => groups.get(groupFn(r)).rightSet.push(r));

        const diffs = groups.getValues().map(g => this.diffSameRanges(g.leftSet, g.rightSet, copyFn));

        const cmpFn = (a, b) => a.start - b.start;
        const mergedDiff = {
            added: this.mergeSortedArrays(diffs.map(a => a.added), cmpFn),
            removed: this.mergeSortedArrays(diffs.map(a => a.removed), cmpFn),
            resized: this.mergeSortedArrays(diffs.map(a => a.resized), cmpFn)
        };

        return mergedDiff;

    }

    static relations() {
        return {
            isBefore: (subject, other) => subject.end <= other.start,
            isAfter: (subject, other) => subject.start >= other.end,
            hasCommon: (subject, other) => subject.end > other.start && subject.start < other.end,
            isEqual: (subject, other) => subject.start === other.start && subject.end === other.end
        };
    }

    static diffSameRanges(leftSet, rightSet, copyFn = r => ({levelId: r.levelId})) {
        let leftIndex = 0;
        let rightIndex = 0;
        const leftLength = leftSet.length;
        const rightLength = rightSet.length;
        const added = [];
        const resized = [];
        const removed = [];
        const relations = this.relations();

        while (true) {
            const rightIsPresent = rightIndex < rightLength;
            const leftIsPresent = leftIndex < leftLength;
            const left = leftSet[leftIndex];
            const right = rightSet[rightIndex];

            if (!leftIsPresent && !rightIsPresent) {
                return {added, removed, resized};
            }
            if (!leftIsPresent) {
                added.push(right);
                rightIndex++;
            } else if (!rightIsPresent) {
                removed.push(left);
                leftIndex++;
            } else {
                // here we have both ranges to comapre
                if (relations.isEqual(left, right)) {
                    // nothing changed, ignoring
                    rightIndex++;
                    leftIndex++;
                } else if (relations.isAfter(left, right)) {
                    added.push(right);
                    rightIndex++;
                } else if (relations.isBefore(left, right)) {
                    removed.push(left);
                    leftIndex++;
                } else {
                    // it has common part
                    const resizedRange = copyFn(left);

                    resizedRange.existing = left;
                    resizedRange.start = right.start;
                    resizedRange.end = right.end;
                    resized.push(resizedRange);
                    leftIndex++;
                    rightIndex++;
                }
            }
        }
    }

    /**
     * Merges sorted arrays into one sorted array
     * @param sortedArrays Object[][]
     * @param cmpFn
     * @return Object[]
     */
    static mergeSortedArrays(sortedArrays, cmpFn = (a, b) => a - b) {

        const result = [];

        const sources = sortedArrays.map(a => ({index: 0, length: a.length, array: a}));

        while (true) {
            // increase
            let maxSource = null;
            let maxSourceCandidate = null;

            for (let source of sources) {
                if (source.index < source.length) {
                    const candidate = source.array[source.index];

                    if (maxSource == null || cmpFn(candidate, maxSourceCandidate) < 0) {
                        maxSource = source;
                        maxSourceCandidate = candidate;
                    }
                }
            }
            if (maxSource == null) {
                return result; // there are no elements left
            }
            maxSource.index++;
            result.push(maxSourceCandidate);
        }

    }
}
module.exports = DiffCalculator;
