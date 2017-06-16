const Supplier = require('./utils/supplier');

/**
 * Generator which consumes values to aggregate and calls callback for every produced aggregation
 * @param levelId
 * @param interval
 * @param callback
 */
module.exports = function *(levelId, interval, callback) {

    const supplier = Supplier(callback);
    const step = {};

    const initStep = (time) => {
        step.sum = 0;
        step.min = Infinity;
        step.max = -Infinity;
        step.count = 0;
        step.openTime = time;
        step.closeTime = time + interval;
        step.missed = 0;
    };

    const emitAggregation = () => {

        const closeTime = step.closeTime;
        const aggregatedPoint = {
            a: step.sum / step.count,
            t: step.max,
            b: step.min,
            c: step.count,
            $s: step.openTime,
            $e: closeTime
        };

        supplier.supply(aggregatedPoint);
        initStep(closeTime);
    };

    const updateAggregation = (value) => {
        if (isNaN(value)) {
            step.missed++;
        } else {
            step.sum += value;
            step.count += 1;
            step.min = Math.min(step.min, value);
            step.max = Math.max(step.max, value);
        }
    };

    try {

        let point = yield;

        initStep(point.$t);

        while (true) {

            if (point.$t >= step.closeTime) {
                emitAggregation();
            }

            updateAggregation(point.v);

            point = yield;

        }

    } finally {
        // we should finish last aggregation
        emitAggregation();
        supplier.finalize();
    }
};
