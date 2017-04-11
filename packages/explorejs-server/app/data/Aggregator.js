var DateUtil = require('../utils/DateUtil');
module.exports = class Aggregator {
    constructor(levelId, interval) {
        this.levelId = levelId;
        this.interval = interval;
        this.init();
    }

    init() {
        this.aggregatedData = [];
        this.firstConsume = true;
        this.step = {
            sum: null,
            min: null,
            max: null,
            count: null,
            openTime: null,
            closeTime: null,
            missed: 0
        };
    }


    Consume(time, value) {
        if (this.firstConsume) {
            this.resetStep(time);
            this.firstConsume = false;
        }
        if (time >= this.step.closeTime) {
            this.proceedToNextStep();
        }
        this.processValue(value);
    }


    Finish() {
        this.proceedToNextStep();
        return this.aggregatedData;
    }

    processValue(value) {
        if (isNaN(value)) {
            this.missed++;
            return;
        }
        this.step.sum += value;
        this.step.count++;
        if (value < this.step.min) {
            this.step.min = value;
        }
        if (value > this.step.max) {
            this.step.max = value;
        }
    }

    proceedToNextStep() {
        var closeTime = this.step.closeTime;
        var aggregatedPoint = {
            a: this.step.sum / this.step.count,
            t: this.step.max,
            b: this.step.min,
            c: this.step.count,
            $s: this.step.openTime,
            $e: closeTime,
            $ss: DateUtil.format(this.step.openTime),
            $ee: DateUtil.format(closeTime)
        };
        this.aggregatedData.push(aggregatedPoint);
        this.resetStep(closeTime);
    }


    resetStep(time) {
        var s = this.step;
        s.sum = 0;
        s.min = Infinity;
        s.max = -Infinity;
        s.count = 0;
        s.openTime = time;
        s.closeTime = time + this.interval;
    }

};