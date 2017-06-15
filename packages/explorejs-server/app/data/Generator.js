var DateUtil = require('../utils/DateUtil')

var lineByLine = require('n-readlines');


module.exports = class Generator {

    constructor() {
        var filename = __dirname + '/../../data/data1.txt';
        this.liner = new lineByLine(filename, {readChunk: 1024 * 100});
        this.liner.next();//drop header
        this.cnt = 0;
    }

    fun(x) {
        this.cnt++;
        if (this.cnt % 100000 == 0) {
            console.log(`Generated ${this.cnt} values`);
        }
        return Number(this.liner.next().toString()); // todo maybe increate read buffer to speed up IO operation
    }

    skip(times) {
        for (let i = 0; i < times; i++) {
            this.liner.next();
        }
    }

    getData(from, to, interval, writeFrom = from) {
        from = from.getTime();
        to = to.getTime();
        var data = [];
        for (var i = from; i < to; i += interval) {
            if (i >= writeFrom) {
                data.push({$t: i, $tt: DateUtil.format(i), v: this.fun(i)});
            }
        }
        console.log(`Finished generation of ${data.length} values`);
        return data;
    }
};