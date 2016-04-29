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
            closeTime: null
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
            $s: this.step.openTime,
            $e: closeTime,
            $ss: new Date(this.step.openTime).toISOString('YYYY-mm-dd'),
            $ee: new Date(closeTime).toISOString()
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