/* global console */

const DateUtil = require('../../explorejs-server/app/utils/DateUtil');
const LineByLine = require('n-readlines');

/**
 * Generates data for given range, interval and data from specified file
 * @param from {number} start timestamp
 * @param to {number} end timestamp
 * @param interval {number} interval between subsequent points
 * @param file {string} path to text file, when every value is placed in separate line
 */
module.exports = function * (from, to, interval, file = __dirname + '/../../explorejs-server/data/data1.txt') {

    const liner = new LineByLine(file, {readChunk: 1024});

    liner.next(); // drop header

    for (let t = from, cnt = 1; t < to; t += interval, cnt++) {

        yield {$t: t, $tt: DateUtil.format(t), v: Number(liner.next().toString())};

        if (cnt % 100000 === 0) {
            console.log(`Generated ${cnt} values`);
        }
    }

};
