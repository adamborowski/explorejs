class Array {
    static last(a) {
        return a == null || a.length == 0 ? null : a[a.length - 1];
    }

    /**
     * Merges two sorted arrays into one
     * @param a {Array}
     * @param b {Array}
     * @param comparator {Function} the function to compare elements from two arrays
     */
    static mergeSorted(a, b, comparator = (a, b)=>a.start - b.start) {
        const aLength = a.length;
        const bLength = b.length;
        var result = [];
        var i1 = 0, i2 = 0;
        while (i1 < aLength || i2 < bLength) {
            if (i1 == aLength) {
                result.push(b[i2++]);
            }
            else if (i2 == bLength) {
                result.push(a[i1++]);
            }
            else if (comparator(a[i1], b[i2]) == 0) {
                result.push(b[i2++]);
                i1++;
            }
            else if (comparator(a[i1], b[i2]) < 0) {
                result.push(a[i1++]);
            }
            else {
                result.push(b[i2++]);
            }
        }
        return result;
    }
}

module.exports = Array;
