class Array {
    static last(a) {
        return a == null || a.length == 0 ? null : a[a.length - 1];
    }
}

module.exports = Array;
