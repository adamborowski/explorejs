var DateUtil = require('../utils/DateUtil')

var lineByLine = require('n-readlines');


module.exports = class Generator {

    constructor() {
        var filename = './data/data1.txt';
        this.liner = new lineByLine(filename);
        this.cnt = 0;
    }

    fun(x) {
        this.cnt++;
        if (this.cnt % 100000 == 0) {
            console.log(`Generated ${this.cnt} values`);
        }
        return Number(this.liner.next().toString()); // todo maybe increate read buffer to speed up IO operation
    }

    getData(from, to, interval) {
        from = from.getTime();
        to = to.getTime();
        var data = [];
        for (var i = from; i < to; i += interval) {
            data.push({$t: i, $tt: DateUtil.format(i), v: this.fun(i)});
        }
        return data;
    }
};