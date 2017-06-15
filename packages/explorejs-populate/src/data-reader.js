/* global console */

const DateUtil = require('../utils/DateUtil');
const LineByLine = require('n-readlines');

module.exports = function * (from, to, interval, file = __dirname + '/../../data/data1.txt') {

    const liner = new LineByLine(file, {readChunk: 1024});

    liner.next(); // drop header

    for (let t = from, cnt = 0; t < to; t += interval, cnt++) {

        yield {$t: t, $tt: DateUtil.format(t), v: liner.next()};

        if (cnt % 100000 === 0) {
            console.log(`Generated ${this.cnt} values`);
        }
    }

};
