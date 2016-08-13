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
}
module.exports = Accumulator;