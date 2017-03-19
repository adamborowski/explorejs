class Accumulator {
    constructor(comparator, handler) {
        this.comparator = comparator;
        this.handler = handler;
        this.values = [];
        this.lastValue = undefined;
    }

    accumulate(value) {
        if (this.lastValue !== undefined) {
            if (!this.comparator(this.lastValue, value)) {
                this.handler(this.values);
                this.values = [];
            }
        }
        this.values.push(value);
        this.lastValue = value;
    }

    finish() {
        if (this.values.length) {
            this.handler(this.values);
        }
    }

    processArray(array) {
        array.forEach(a=>this.accumulate(a));
        this.finish();
    }

    /**
     * Splits given array to different arrays based on comparison argument.
     * This creates groups of subsequent elements which are the same (by evaluating comparator)
     * @param array
     * @param cmp comparator function
     * @param [ret] {Array} output array, if not specified, new array will be created
     * @return {Array} output array
     */
    static splitArray(array, cmp, ret = []) {
        var acc = new Accumulator(cmp, a=>ret.push(a));

        acc.processArray(array);
        return ret;
    }
}
module.exports = Accumulator;
