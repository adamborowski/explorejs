/* global console */

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

    let loop = 1;

    for (let t = from, cnt = 1; t < to; t += interval, cnt++) {

        let line = liner.next();

        if (line === false) {
            loop += 1;
            liner.reset();
            line = liner.next();
        }

        yield {$t: t, v: Number(line.toString()) * loop};

        if (cnt % 100000 === 0) {
            console.log(`Generated ${cnt} values`);
        }
    }

};
